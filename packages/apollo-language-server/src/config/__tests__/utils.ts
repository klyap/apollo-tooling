import {
  ApolloConfig,
  ApolloConfigFormat,
  getGraphIdFromKey,
  getGraphInfo,
  isClientConfig,
  isLocalServiceConfig,
  isServiceConfig,
  parseServiceSpecifier
} from "../";
import { createConfig } from "./config";

describe("getServiceFromKey", () => {
  it("returns undefined with no provided key", () => {
    expect(getGraphIdFromKey()).toBeUndefined();
  });

  it("returns service name from service api key", () => {
    const key = "service:bob-123:489fhseo4";
    expect(getGraphIdFromKey(key)).toEqual("bob-123");
  });

  it("returns nothing if key is not a service key", () => {
    const key = "not-a-service:bob-123:489fhseo4";
    expect(getGraphIdFromKey(key)).toBeUndefined();
  });

  it("returns nothing if key is malformed", () => {
    const key = "service/bob-123:489fhseo4";
    expect(getGraphIdFromKey(key)).toBeUndefined();
  });
});

describe("getServiceName", () => {
  describe("client config", () => {
    it("finds service name when client.service is a string", () => {
      const rawConfig: ApolloConfigFormat = createConfig({
        client: { service: "my-service" }
      });
      expect(getGraphInfo(rawConfig).graphId).toEqual("my-service");

      const rawConfigWithTag: ApolloConfigFormat = createConfig({
        client: { service: "my-service@master" }
      });
      expect(getGraphInfo(rawConfigWithTag).graphId).toEqual("my-service");
    });

    it("finds service name when client.service is an object", () => {
      const rawConfig: ApolloConfigFormat = createConfig({
        client: { service: { name: "my-service" } }
      });
      expect(getGraphInfo(rawConfig).graphId).toEqual("my-service");
    });
  });
  describe("service config", () => {
    it("finds service name from raw service config", () => {
      const rawConfig: ApolloConfigFormat = createConfig({
        service: { name: "my-service" }
      });
      expect(getGraphInfo(rawConfig).graphId).toEqual("my-service");
    });
  });
});

describe("isClientConfig", () => {
  it("identifies client config properly", () => {
    const config = new ApolloConfig(
      createConfig({ client: { service: "hello" } })
    );
    expect(isClientConfig(config)).toBeTruthy();
  });
});

describe("isLocalServiceConfig", () => {
  it("properly identifies a client config that uses localSchemaFiles", () => {
    const clientServiceConfig = { localSchemaFile: "okay" };
    expect(isLocalServiceConfig(clientServiceConfig)).toBeTruthy();
  });
});

describe("isServiceConfig", () => {
  it("identifies service config properly", () => {
    const config = new ApolloConfig(
      createConfig({ service: { name: "hello" } })
    );
    expect(isServiceConfig(config)).toBeTruthy();
  });
});

describe("parseServiceSpecifier", () => {
  it("parses service identifier for service id and tag properly", () => {
    const [id, tag] = parseServiceSpecifier("my-service@master");
    expect(id).toEqual("my-service");
    expect(tag).toEqual("master");

    const [idFromSimpleName, tagFromSimpleName] = parseServiceSpecifier(
      "my-service"
    );
    expect(idFromSimpleName).toEqual("my-service");
    expect(tagFromSimpleName).toBeUndefined();
  });
});
