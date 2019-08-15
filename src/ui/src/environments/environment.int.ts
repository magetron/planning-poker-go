//This environment is for amazon ec2
export const environment = {
  production: true,

  baseUrl: location.origin + '/#',

  apiUrl: "http://planning-poker-nlb-ec2-e86c54390baa9c80.elb.eu-west-1.amazonaws.com:8080",
  infoSocket : "ws://planning-poker-nlb-ec2-e86c54390baa9c80.elb.eu-west-1.amazonaws.com:8080/info/"
};
