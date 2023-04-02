const webcrypto = require("crypto").webcrypto
export const crypto: Crypto = webcrypto

import { v4 as generateUuid } from "uuid"

import { CliUx as cli } from "@oclif/core"

export { cli, generateUuid }
