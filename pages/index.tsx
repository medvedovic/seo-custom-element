import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.sass";

import Script from "next/script";
import React from "react";
import { MetaData } from "../components/MetaData";

declare const CustomElement: any;

type State = {
  readonly title: string;
  readonly description: string;
  readonly url: string;
};

const initialState: State = {
  title: "no-title",
  description: "no-description",
  url: "no-url",
};

const readElement = <T extends unknown = string>(elementName: string) =>
  new Promise<T>((resolve) => {
    CustomElement.getElementValue(elementName, (value: T) => {
      resolve(value);
    });
  });

const Home: NextPage = () => {
  const [failed, setFailed] = React.useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);
  const [state, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    if (!isScriptLoaded) return;

    const initialize = async () => {
      try {
        const promises = ["title", "meta_description", "friendly_url"].map(
          readElement
        );
        const [title, description, url] = await Promise.all(promises);
        setState((prevState) => ({
          ...prevState,
          title,
          description,
          url,
        }));

        CustomElement.setHeight(600);
      } catch (error) {
        console.error(
          `Something went wrong while initializing custom element: ${error}`
        );
        setFailed(true);
      }
    };

    initialize();
  }, [isScriptLoaded, setFailed]);

  if (failed) {
    return <div>Failed</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        onLoad={() => setIsScriptLoaded(true)}
        src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js"
      />

      <main className={styles.main}>
        <MetaData title="Meta title:" value={state.title} />
        <MetaData title="Meta description:" value={state.description} />
        <MetaData title="Friendly url:" value={state.url} />
      </main>
    </div>
  );
};

export default Home;
