//This environment is for amazon ec2
export const environment = {
  production: true,

  baseUrl: location.origin + '/#',

  apiUrl: "http://ec2-18-200-142-113.eu-west-1.amazonaws.com:8080",
  infoSocket : "ws://ec2-18-200-142-113.eu-west-1.amazonaws.com:8080/info/"
};
