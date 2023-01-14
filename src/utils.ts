const modifyRequestTypeImportPath = (requestType: string) => {
  return `./request-types/${requestType.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`
};

export async function getBodySchema(requestType: string) {
  const module = await import(modifyRequestTypeImportPath(requestType));
  return module.bodySchema
}

export async function getResponseSchema(requestType: string) {
  const module = await import(modifyRequestTypeImportPath(requestType));
  return module.responseSchema
}

export async function getDefaultRequest(requestType: string) {
  const module = await import(modifyRequestTypeImportPath(requestType));
  return module.defaultRequest
}