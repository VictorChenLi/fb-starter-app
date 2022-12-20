const envStaging = {
  client_id: "330180d208859d1ec9e9ce0d0170e8465a302ec32d63eb38e0bccd5e9541a706",
  client_secret:
    "bb62bf52d8daf67fe89f85437e998c4a7ab924014da34efe2dff0fb867f74606",
  redirect_uri: "https://4plvds-3000.preview.csb.app/",
  auth_page:
    "https://auth.freshbooks.com/oauth/authorize?client_id=330180d208859d1ec9e9ce0d0170e8465a302ec32d63eb38e0bccd5e9541a706&response_type=code&redirect_uri=https%3A%2F%2F4plvds-3000.preview.csb.app%2F&scope=user%3Aprofile%3Aread%20user%3Atime_entries%3Aread%20user%3Atime_entries%3Awrite",
};

const envProduction = {
  client_id: "<Replace With Your Client ID>",
  client_secret: "<Replace With Your Client Secret>",
  redirect_uri: "<Replace with your codesandbox url>",
  auth_page: "<Replace with your authentication page url>",
};

export const envVariable = envStaging;
