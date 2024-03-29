import { readFileSync } from "node:fs";
import velocityjs from "velocityjs";

function main() {
  const data = loadData();
  if (data.error_message != null) {
    const response = {
      tab: "failed to load data",
      text: data.error_message,
      isError: true,
    };
    console.log(JSON.stringify(response));
    return;
  }

  const template = loadTemplate();
  if (template.isError) {
    const response = { tab: "failed to load template", ...template };
    console.log(JSON.stringify(response));
  }

  try {
    const response = {
      tab: "Result",
      text: new velocityjs.Compile(velocityjs.parse(template.text)).render(
        data.data,
      ),
      isError: false,
    };
    console.log(JSON.stringify(response));
  } catch (e) {
    const response = {
      tab: "failed to render by velocity",
      text: e.stack,
      isError: true,
    };
  }
}

/**
 * @return {{data: Object, error_message: string | null}}
 */
function loadData() {
  try {
    const text = readFileSync("data.json").toString();
    return {
      data: JSON.parse(text),
      error_message: null,
    };
  } catch (e) {
    return {
      data: null,
      error_message: e.stack,
    };
  }
}

/**
 * @return {{text: string, isError: boolean}}
 */
function loadTemplate() {
  try {
    return {
      text: readFileSync("template.vtl").toString(),
      isError: false,
    };
  } catch (e) {
    return {
      text: e.stack,
      isError: true,
    };
  }
}

main();
