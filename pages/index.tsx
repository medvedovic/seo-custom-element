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
import { readElementAsync } from "../utils/readElementAsync";
import useResizeObserver from "use-resize-observer";

declare const CustomElement: any;

type Elements = {
  readonly title: string;
  readonly description: string;
  readonly url: string;
};

const noData: Elements = {
  title: "no-title",
  description: "no-description",
  url: "no-url",
};

enum InitializationState {
  Initializing = "initializing",
  Failed = "failed",
  Loaded = "loaded",
}

const fetchElements = async (elementCodenames: readonly string[]) => {
  const promises = elementCodenames.map(readElementAsync);
  return await Promise.all(promises);
};

const Home: NextPage = () => {
  const [initializationState, setInitializationState] = React.useState(
    InitializationState.Initializing
  );
  const [elements, setElements] = React.useState<Elements>(noData);
  const [elementCodenames, setElementCodenames] = React.useState<
    readonly string[]
  >(["title", "meta_description", "friendly_url"]);
  const { ref, height = 0 } = useResizeObserver<HTMLDivElement>();

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;
    CustomElement.setHeight(height);
  }, [initializationState, height]);

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;
    CustomElement.observeElementChanges(
      [],
      (changedElementCodenames: readonly string[]) => {
        setElementCodenames(changedElementCodenames);
      }
    );
  }, [initializationState]);

  React.useEffect(() => {
    if (!(initializationState === InitializationState.Loaded)) return;

    const initialize = async () => {
      try {
        const [title, description, url] = await fetchElements(elementCodenames);
        setElements((prev) => ({
          title: title ?? prev.title,
          description: description ?? prev.description,
          url: url ?? prev.url,
        }));
      } catch (error) {
        console.error(
          `Something went wrong while initializing custom element: ${error}`
        );
        setInitializationState(InitializationState.Failed);
      }
    };

    initialize();
  }, [initializationState, elementCodenames]);

  if (initializationState === InitializationState.Failed) {
    return <div>Failed</div>;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        onLoad={() => setInitializationState(InitializationState.Loaded)}
        src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js"
      />

      <main className={styles.main} ref={ref}>
        <Preview {...elements} />
        <div className={styles.container}>
          <MetaData
            title="Meta title:"
            value={elements.title}
            errors={Array.from(validateTitle(elements.title))}
          />
          <MetaData
            title="Meta description:"
            value={elements.description}
            errors={Array.from(validateDescription(elements.description))}
          />
          <MetaData
            title="Friendly url:"
            value={elements.url}
            errors={Array.from(validateUrl(elements.url))}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
