//This environment is for development with a local golang server
export const environment = {
  production: true,
  
  baseUrl: location.origin + '/#',
  
  apiUrl: "http://localhost:8080/v2",
  infoSocket : "ws://localhost:8080/v2/info/"
};
