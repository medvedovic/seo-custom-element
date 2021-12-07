declare const CustomElement: any;

export const readElementAsync = <T extends unknown = string>(
  elementName: string
) =>
  new Promise<T>((resolve) => {
    CustomElement.getElementValue(elementName, (value: T) => {
      resolve(value);
    });
  });
