declare const CustomElement: any;

export const getElementValueAsync = <T extends unknown = string>(
  elementName: string
) =>
  new Promise<T>((resolve) => {
    // this may explode if not used correctly due to race-condition caused
    // by loading CustomElement script
    CustomElement.getElementValue(elementName, (value: T) => {
      resolve(value);
    });
  });
