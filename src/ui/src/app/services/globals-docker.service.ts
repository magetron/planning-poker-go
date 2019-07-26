export const apiUrl = "http://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080";
export const baseUrl = location.origin + '/#';

export const voteSocket = "ws://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080/userinfo";
export const socketRefreshTime = 1000; //how often to update user votes
export const roundInfoSocket = "ws://planning-poker-nlb-febe808a469ef781.elb.eu-west-1.amazonaws.com:8080/roundinfo";
