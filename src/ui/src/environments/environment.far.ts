//This environment if for Amazon fargate
export const environment = {
  production: true,
  
  baseUrl: location.origin + '/#',
  
  apiUrl: "http://planning-poker-nlb-2f296abfc5666965.elb.eu-west-1.amazonaws.com:8080/",
  infoSocket : "ws://planning-poker-nlb-2f296abfc5666965.elb.eu-west-1.amazonaws.com:8080/info/"
};
