## bash call.sh /entities POST '{"name": "Maxime Daniel", "country": 0, "city": 0}'

bash callo.sh /entities POST '{"name": "Maxime Daniel", "country": 0, "city": 0}'
bash call.sh /twins POST '{"ip": "200:b57d:d1f0:aad3:71f3:bf:232:9c4"}'

bash callo.sh /signature POST '{"entity": 4, "twin": 2}'

## 069bb941baedaa4a9ff998c6f36b4b21b1b825ddc4fafa48011002f94b9e1a6dd67b3da815ea9a48eff996fc8d335603763ae3c1f7f43ba59fd162dce43e5e09
bash call.sh /twins/2/entities POST '{"signature": "", "entity": 4}'

bash call.sh /farms POST '{"name": "Maxux Farm", "entity": 4, "twin": 2, "country": 0, "city": 0, "policy": 0}'

# delete farm entities
bash call.sh /entities DELETE
