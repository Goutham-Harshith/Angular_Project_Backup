export class Constants {

    public static nodesInfo: sourceDetails[] = [
        {
            nodeTypeId: 1,
            nodeName: "file",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-1.png"
        },
        {
            nodeTypeId: 2,
            nodeName: "folder",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-1.png"
        },
        {
            nodeTypeId: 3,
            nodeName: "hdfs",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-5.png"
        },
        {
            nodeTypeId: 5,
            nodeName: "neo4J",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 7,
            nodeName: "hbase",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 9,
            nodeName: "python",
            nodeType: "script",
            nodeImage: "assets/images/lineage-icon-15.png"
        },
        {
            nodeTypeId: 10,
            nodeName: "mongo",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 11,
            nodeName: "ppt",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 12,
            nodeName: "psql",
            nodeType: "script",
            nodeImage: "assets/images/lineage-icon-13.png"
        },
        {
            nodeTypeId: 14,
            nodeName: "locdir",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 16,
            nodeName: "snowflake",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-10.png"
        },
        {
            nodeTypeId: 17,
            nodeName: "snowflakesql",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-11.png"
        },
        {
            nodeTypeId: 18,
            nodeName: "sftp",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-16.png"
        },
        {
            nodeTypeId: 19,
            nodeName: "cassandra",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-17.png"
        },
        {
            nodeTypeId: 23,
            nodeName: "minio",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-14.png"
        },
        {
            nodeTypeId: 25,
            nodeName: "psql",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-12.png"
        },
        {
            nodeTypeId: 26,
            nodeName: "oracle",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-18.png"
        },
        {
            nodeTypeId: 30,
            nodeName: "sql",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-4.png"
        },
        {
            nodeTypeId: 60,
            nodeName: "hive",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-2.png"
        },
        {
            nodeTypeId: 61,
            nodeName: "els",
            nodeType: "data",
            nodeImage: "assets/images/lineage-icon-8.png"
        },
        {
            nodeTypeId: 90,
            nodeName: "kafka",
            nodeType: "data",
            nodeImage: ""
        },
        {
            nodeTypeId: 40,
            nodeName: "datapreparation",
            nodeType: "pyspark",
            nodeImage: ""
        },
        {
            nodeTypeId: 41,
            nodeName: "datapreparation",
            nodeType: "pyspark-dp",
            nodeImage: ""
        }
    ]

    public static fetchNodeByID(nodeTypeId: number) {
        return this.nodesInfo.find(node => node.nodeTypeId == nodeTypeId)
    }

    public static fetchNodeByNameType(nodeName: string, nodeType: string) {
        return this.nodesInfo.find(node => ((node.nodeName == nodeName.toLowerCase()) && (node.nodeType == nodeType.toLowerCase())))
    }
}
export interface sourceDetails {
    nodeTypeId: number;
    nodeName: string;
    nodeType: string;
    nodeImage: string;
}