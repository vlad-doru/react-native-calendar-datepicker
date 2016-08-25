lsof -n -t -i4TCP:8081 | xargs kill -9 
npm start
