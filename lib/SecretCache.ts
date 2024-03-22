import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface Dependencies {
  secretsManager: SecretsManager;
}

export interface SecretCache {
  getSecretValue<T>(secretName: string): Promise<T>;
}

export class SecretCacheImpl implements SecretCache {
  private readonly secretsManager: SecretsManager;
  private readonly cache = new Map<string, string>();

  constructor(dep: Dependencies) {
    this.secretsManager = dep.secretsManager;
  }

  getSecretValue = async <T>(secretId: string): Promise<T> => {
    const cacheValue = this.cache.get(secretId);
    if (cacheValue) {
      return JSON.parse(cacheValue) as T;
    }

    const { SecretString: secretValue } =
      await this.secretsManager.getSecretValue({
        SecretId: secretId,
      });
    if (!secretValue) {
      throw new Error(`Could not retrieve secret '${secretId}'.`);
    }
    this.cache.set(secretId, secretValue);
    return JSON.parse(secretValue) as T;
  };
}
