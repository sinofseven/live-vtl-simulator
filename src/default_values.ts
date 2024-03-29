export const DEFAULT_TEXT_TEMPLATE: string =
  "#foreach($item in $items)\n" + "    $item.a\n" + "#end";

export const DEFAULT_TEXT_DATA: string =
  "{\n" +
  '    "items": [\n' +
  '        {"a": "1"},\n' +
  '        {"a": "successed"}\n' +
  "    ]\n" +
  "}";
