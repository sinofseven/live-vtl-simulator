import { WebContainer } from "@webcontainer/api";
import { useCallback, useEffect, useState } from "react";

import { text as TEXT_MAIN_MJS } from "@/assets/main.mjs.json";

export function useWebContainer(): [
  boolean,
  (
    text: string,
    data: string,
  ) => Promise<{ tab: string; text: string; isError: boolean }>,
] {
  const [isLoading, setIsLoading] = useState(true);
  const [flagLoading, setFlagLoading] = useState(false);
  const [stateContainer, setStateContainer] = useState<WebContainer | null>(
    null,
  );

  const initialize = useCallback(async () => {
    const container = await WebContainer.boot();
    const files = {
      "main.mjs": {
        file: {
          contents: TEXT_MAIN_MJS,
        },
      },
    };
    await container.mount(files);
    const process = await container.spawn("npm", ["install", "velocityjs"]);
    await process.exit;
    setStateContainer(container);
    setIsLoading(false);
  }, []);

  const renderByVelocity = useCallback(
    async (
      template: string,
      data: string,
    ): Promise<{ tab: string; text: string; isError: boolean }> => {
      if (stateContainer == null) {
        return {
          tab: "",
          text: "",
          isError: true,
        };
      }
      try {
        const files = {
          "template.vtl": {
            file: {
              contents: template,
            },
          },
          "data.json": {
            file: {
              contents: data,
            },
          },
        };
        await stateContainer.mount(files);
      } catch (e) {
        return {
          tab: "failed to mount data files",
          text: (e as Error).stack!,
          isError: true,
        };
      }
      try {
        const process = await stateContainer.spawn("node", ["main.mjs"]);
        await process.exit;
        const { value } = await process.output.getReader().read();
        return JSON.parse(value!);
      } catch (e) {
        return {
          tab: "failed to render by velocity",
          text: (e as Error).stack!,
          isError: true,
        };
      }
    },
    [stateContainer],
  );

  useEffect(() => {
    if (flagLoading) {
      return;
    }
    setFlagLoading(true);
    initialize();
  }, [initialize, flagLoading]);

  return [isLoading, renderByVelocity];
}
