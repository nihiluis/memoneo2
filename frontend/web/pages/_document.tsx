import { NextPageContext } from "next"
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document"
import { DEV, BASE_PATH, SITE_TITLE } from "../src/constants/env"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href={DEV ? "/favicon.png" : BASE_PATH + "/favicon.png"} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
