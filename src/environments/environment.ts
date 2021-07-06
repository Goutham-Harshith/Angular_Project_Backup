// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false
// };
export const environment = {
  production: false,
  baseUrl: "http://10.0.0.7:7070",
  // dap_backend_url:"http://dapubuntu:8080/dap-backend",
  authServer: "http://10.0.0.7:7070/authserver",
  elsServer: "http://10.0.0.7:7070/ElasticSearchRestApi", 
  zepplinURL: "http://Airflow:9080/",
  websocket: "ws://10.0.0.7:7070/dap-app-websocket/socket",
  // Mysql
  // dbPort : 3306,
  // dbName : "dapdb",
  // dbUrl : "jdbc:mysql://dapubuntu",
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


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
