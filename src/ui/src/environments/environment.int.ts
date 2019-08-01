export const environment = {
  production: true,
  //gateway: 'http://3.248.4.156:8080',
  apiUrl: "http://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080",
  baseUrl: location.origin + '/#',
  socketRefreshTime: 1000, //how often to update user votes
  infoSocket : "ws://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080/info/"
};
