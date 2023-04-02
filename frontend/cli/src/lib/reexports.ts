const webcrypto = require("crypto").webcrypto
export const crypto: Crypto = webcrypto

import { v4 as generateUuid } from "uuid"

import { ux as cliUx } from "@oclif/core"

export { cliUx, generateUuid }
