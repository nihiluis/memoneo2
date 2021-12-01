import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import { DEV, BASE_PATH, SITE_TITLE } from "../src/constants/env"

class MyDocument extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    try {
      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
      }
    } finally {
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            href={DEV ? "/favicon.png" : BASE_PATH + "/favicon.png"}
          />
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
