import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.sass";

import Script from "next/script";
import React from "react";
import { MetaData } from "../components/MetaData";
import { Preview } from "../components/Preview";
import {
  validateDescription,
  validateTitle,
  validateUrl,
} from "../utils/validators";
import { getElementValueAsync } from "../utils/getElementValueAsync";
import useResizeObserver from "use-resize-observer";

// CustomElement is available globally, but typescript compiler doesn't know that
declare const CustomElement: any;

type ElementValues = {
  readonly title: string;
  readonly description: string;
  readonly url: string;
};

const emptyElementValues: ElementValues = {
  title: "no-title",
  description: "no-description",
  url: "no-url",
};

enum InitializationState {
  Initializing = "initializing",
  Failed = "failed",
  Loaded = "loaded",
}

enum Codenames {
  Title = "title",
  Description = "meta_description",
  Url = "friendly_url",
}

const codenameToStateName: Record<Codenames, keyof ElementValues> = {
  [Codenames.Title]: "title",
  [Codenames.Description]: "description",
  [Codenames.Url]: "url",
};

const getElementValuesByCodenames = async (
  elementCodenames: readonly Codenames[]
): Promise<Partial<ElementValues>> => {
  const promises = elementCodenames.map(getElementValueAsync);
  const result = await Promise.all(promises);

  return elementCodenames.reduce(
    (accumulator, current, index) => ({
      ...accumulator,
      [codenameToStateName[current]]: result[index],
    }),
    {}
  );
};

const Home: NextPage = () => {
  const [initializationState, setInitializationState] = React.useState(
    InitializationState.Initializing
  );
  const [elementValues, setElementValues] =
    React.useState<ElementValues>(emptyElementValues);
  const [changedElementCodenames, setChangedElementCodenames] = React.useState<
    readonly Codenames[]
  >(Object.values(Codenames));
  const { ref, height = 0 } = useResizeObserver<HTMLDivElement>();

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;
    CustomElement.setHeight(height);
  }, [initializationState, height]);

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;
    CustomElement.observeElementChanges(
      [], // Subscribe to all element changes
      (changedElementCodenames: readonly Codenames[]) => {
        setChangedElementCodenames(changedElementCodenames);
      }
    );
  }, [initializationState]);

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;

    const loadElementValues = async () => {
      try {
        const newValues = await getElementValuesByCodenames(
          changedElementCodenames
        );
        setElementValues((previousValues) => ({
          ...previousValues,
          ...newValues,
        }));
      } catch (error) {
        console.error(
          `Something went wrong while initializing custom element: ${error}`
        );
        setInitializationState(InitializationState.Failed);
      }
    };

    loadElementValues();
  }, [initializationState, changedElementCodenames]);

  if (initializationState === InitializationState.Failed) {
    return <div>Failed</div>;
  }

  return (
    <div>
      <Head>
        <title>Seo custom element</title>
        <meta
          name="description"
          content="Seo custom element analysis for Kontent by Kentico"
        />
      </Head>

      <Script
        onLoad={() => setInitializationState(InitializationState.Loaded)}
        src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js"
      />

      <main className={styles.main} ref={ref}>
        <Preview {...elementValues} />
        <div className={styles.container}>
          <MetaData
            title="Meta title:"
            value={elementValues.title}
            errors={Array.from(validateTitle(elementValues.title))}
          />
          <MetaData
            title="Meta description:"
            value={elementValues.description}
            errors={Array.from(validateDescription(elementValues.description))}
          />
          <MetaData
            title="Friendly url:"
            value={elementValues.url}
            errors={Array.from(validateUrl(elementValues.url))}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
