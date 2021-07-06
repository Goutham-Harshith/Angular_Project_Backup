export const environment = {
  production: false,
  baseUrl: "https://wdas.eastus.cloudapp.azure.com:8443",
  // dap_backend_url:"http://40.121.41.30:8080/dap-backend",
  authServer: "https://wdas.eastus.cloudapp.azure.com:8443/authserver",
  elsServer: "https://wdas.eastus.cloudapp.azure.com:8443/ElasticSearchRestApi", 
  zepplinURL: "https://Airflow:9080/",
  websocket: "wss://wdas.eastus.cloudapp.azure.com:8443/dap-app-websocket/socket",
  // Mysql
  // dbPort : 3306,
  // dbName : "dapdb",
  // dbUrl : "jdbc:mysql://40.121.41.30",
  // dbUser : "dapdbuser",
  // dbPassword : "Dapdbuser@2019",
  // driverClass : "com.mysql.cj.jdbc.Driver"
  
  //Oracle
  dbPort : 1556,
  dbName : "EBSVIS",
  dbUrl : "jdbc:oracle:thin:@192.168.1.242",
  dbUser : "apps",
  dbPassword : "apps",
  driverClass : "oracle.jdbc.driver.OracleDriver"
};