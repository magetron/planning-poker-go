//This environment if for Amazon fargate
export const environment = {
  production: true,
  
  baseUrl: location.origin + '/#',
  
  apiUrl: "http://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080",
  infoSocket : "ws://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080/info/"
};
