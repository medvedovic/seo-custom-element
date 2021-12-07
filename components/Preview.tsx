import SerpPreview from "react-serp-preview";
import React from "react";

type Props = {
  readonly title: string;
  readonly description: string;
  readonly url: string;
};

export const Preview: React.FC<Props> = (props) => {
  const [shouldShowChild, setShouldShowChild] = React.useState(false);

  React.useEffect(() => {
    // Deffer rendering of component with `useLayoutEffect`
    // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
    setShouldShowChild(true);
  }, []);

  return !shouldShowChild ? null : (
    <SerpPreview
      title={props.title}
      metaDescription={props.description}
      url={`https://your-domain.com/${props.url}`}
    />
  );
};
