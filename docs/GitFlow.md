# Planning Poker Git Flow

1. Never merge from develop directly into master anymore
2. Every week, create an integration branch named `int${nprint_num}`
3. Deploy the integration branch on `ec2`
4. Test the integration branch in the integration environment until all team members are happy with it
    * One person creates the PR
    * Another person comments approvingly
    * A different person merges
1. Only then can it be merged into master and deployed on `Fargate`