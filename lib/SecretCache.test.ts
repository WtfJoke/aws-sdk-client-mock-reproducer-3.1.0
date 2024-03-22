import {
  GetSecretValueCommand,
  SecretsManager,
} from "@aws-sdk/client-secrets-manager";
import { mockClient } from "aws-sdk-client-mock";
import { SecretCacheImpl } from "./SecretCache.js";

describe("SecretCache", () => {
  it("should return secret value object", async () => {
    // ARRANGE
    const secretManagerMock = mockClient(SecretsManager);
    const secretCache = new SecretCacheImpl({
      secretsManager: new SecretsManager({}),
    });

    secretManagerMock.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify({ foo: "bar" }),
    });

    // ACT
    const secretObject = await secretCache.getSecretValue("secret1");

    // ASSERT
    expect(secretObject).toEqual({ foo: "bar" });
    expect(secretManagerMock).toHaveReceivedCommandWith(GetSecretValueCommand, {
      SecretId: "secret1",
    });
  });
});
