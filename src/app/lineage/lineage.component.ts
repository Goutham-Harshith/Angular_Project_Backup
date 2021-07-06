import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
declare var $: any
import { LineageService } from './lineage.service';
import { Subject } from 'rxjs';
import { Constants } from 'src/constants';
@Component({
    selector: 'app-lineage',
    templateUrl: './lineage.component.html',
    styleUrls: ['./lineage.component.css']
})

export class LineageComponent implements OnInit {
    newTableName: string
    isDisableNewTable: boolean = true
    queryToExecute: string;
    exutequeries = [];
    tbljoin: boolean = false
    tname: string;
    tlevel: number;
    nodId: number;
    lineageId: number;
    tablename: string;
    localflowid: number;
    projectName = ''
    tableName = "";
    list = [];
    map = {};
    response: any;
    flowId :number;
    X: number;
    Y: number;
    scale: number
    enableWrangle: boolean = false;
    enableScript: boolean =false;
    isSelectAll = {};
    isWrangleTblsLoaded = false;
    createTable: boolean = false
    preview: boolean = true
    showPreview: boolean = false;
    showcreateTable: boolean = false
    tableList = [];
    colSearchText = {};
    selColumns = {};
    columns =[];
    fetchCol:boolean=false;
    joinData = {
        joinType: "Inner Join",
        firstCol: "",
        secondCol: "",
        firstTbl: "",
        secondTbl: ""
    };
    previewWrangledData = {};
    showWrangledForm = true;
    joinQuery;
    // ngx-graph varibales start
    draggingEnabled: boolean = true;
    panningEnabled: boolean = true;
    zoomEnabled: boolean = true;
    zoomSpeed: number = 0.05;
    minZoomLevel: number = 0.1;
    maxZoomLevel: number = 4.0;
    panOnZoom: boolean = true;
    autoZoom: boolean = true;
    autoCenter: boolean = true;
    update$: Subject<boolean> = new Subject();
    center$: Subject<boolean> = new Subject();
    zoomToFit$: Subject<boolean> = new Subject();
    nodes: Node[];
    links: Edge[];
    name = 'Lineage';
    layout: String | Layout = 'dagreCluster';
    // ngx-graph varibales end

    constructor(private route: ActivatedRoute, public router: Router, private lineageService: LineageService) {
        $(document).ready(() => {
            $('.anchor').on('click', function () {
                var width = parseInt($(this).parent().css('width'));
                if (width == 10) {
                    $(this).parent().css('width', '20%');
                    $('#canvas').css('width', '60%');
                } else {
                    $(this).parent().css('width', '10px');
                    $('#canvas').css('width', 'calc( 80% - 10px)');
                }
            });
        });
    }

    ngOnInit() {
        $(".more_option").click(function () {
            $(".extra_options").toggle();
        });
        let that = this;
        let flowId: number;
        this.route.queryParams.subscribe(params => {
            flowId = parseInt(params['flowId']);
            this.projectName = (params['projectName']);
        });
        that.flowId = flowId
        this.showLineage(this.flowId)
    }

    submitJoinData() {
        this.showcreateTable=false;
        let reqBody = {
            "task": "",
            "columnsList": this.getSelectedColumnsList(this.joinData["firstTbl"]).concat(this.getSelectedColumnsList(this.joinData["secondTbl"])),
            "tableColumnJoinTypeList": [
                {
                    "tableColumns": [
                        {
                            "sourceTableName1": this.joinData["firstTbl"],
                            "sourceColumnName1": this.joinData["firstCol"],
                            "sourceTableName2": this.joinData["secondTbl"],
                            "sourceColumnName2": this.joinData["secondCol"]
                        }
                    ],
                    "joinType": this.joinData["joinType"]
                }
            ],
            "selectedFlowId": 1,
            "nodeTypeId": "25",
            "queryLogicParam": []
        }
        this.lineageService.fetchWrangle(reqBody).subscribe(response => {
            this.previewWrangledData = response["response"];
            this.showWrangledForm = false;
            this.showPreview=true
        });
    }

    getValueByTblName(tName) {
        for (let i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].tbl == tName) {
                return this.tableList[i];
            }
        }
        return false;
    }
    setColumnsByTblName(tname,col){
        for (let i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].tbl == tname ) {
                if(this.tableList[i].columns ==null){
                return this.tableList[i].columns=col;}
                else return this.tableList[i].columns;
            }
        }
        return false;
    }
    selectAll(tName) {
        let columnList = this.getValueByTblName(tName)["columns"];
        if (!columnList) {
            return;
        }
        for (let i = 0; i < columnList.length; i++) {
            if (this.isSelectAll[tName]) {
                this.selColumns[tName][columnList[i]["columnName"]] = true;
            } else {
                this.selColumns[tName][columnList[i]["columnName"]] = false;
            }
        }
    }

    getSelectedColumnsList(tname) {
        var col = [];
        for (let index in this.selColumns[tname]) {
            if (this.selColumns[tname][index]) {
                col.push(tname + "." + index);
            }
        }
        return col;
    }

    getRelatedColumns(tname) {
        var col = [];
        for (let index in this.selColumns[tname]) {
            if (this.selColumns[tname][index]) {
                col.push(index);
            }
        }
        return col;
    }
    
    fetchcolumns(){
        this.columns =[]
        this.fetchCol=true;
        let columnList = this.getValueByTblName(this.tableName)["columns"];
        console.log("columns ",columnList)
        if(columnList==null)
        {
        this.lineageService.fetchColumns(this.tableName,this.tlevel).subscribe(res =>{
            this.columns =res["response"];
            let col =this.columns;
            if(this.columns){
                this.setColumnsByTblName(this.tableName,col);
                console.log("table lis"+this.tableList)
                this.addTable();
                this.fetchCol=false;
            }
        })
        }else {
            this.columns=this.getValueByTblName(this.tableName)["columns"];
            this.addTable();
            this.fetchCol=false;
        }

    }
    // redirectToJoin(){
    //     this.showWrangledForm=true;
    // }
    addTable() {
        
        if (this.list.length >= 2) {
            return;
        }
        let that = this;
        this.selColumns[this.tableName] = {};
        let columns =this.columns;
        
        if (!columns) {
            return;
        }
        this.list.push({
            "name": this.tableName,
            "columns": columns
        });
        this.tableName = "";
        setTimeout(() => {
            $(document).find('.ui-item').draggable({
                containment: "#canvas",
                drag: function (event, ui) {
                    setTimeout(() => {
                        var lines = $(this).data('lines');
                        var con_item = $(this).data('connected-item');
                        var con_lines = $(this).data('connected-lines');
                        console.log("dragged card");
                        if (lines) {
                            lines.forEach(function (line, id) {
                                $(line).attr('x1', $(this).position().left + ($(this).width() / 2)).attr('y1', $(this).position().top + 1 + ($(this).height() / 2));
                            }.bind(this));
                        }
                        if (con_lines) {
                            con_lines.forEach(function (con_line, id) {
                                $(con_line).attr('x2', $(this).position().left + 5)
                                    .attr('y2', $(this).position().top + (parseInt($(this).css('height')) / 2) + (id * 5));
                            }.bind(this));
                        }
                        var connector = $('#connector_canvas');
                        let cur_con = $(connector.find("line")[0]);
                        let posLeft = parseInt(cur_con.attr("x1"));
                        let posRight = parseInt(cur_con.attr("x2"));
                        let posTop = parseInt(cur_con.attr("y1"));
                        let posBottom = cur_con.attr("y2");
                        let iconLeft = posLeft + ((posRight - posLeft - ($(this).width() / 2)) / 2) + ($(this).width() / 2);
                        $(".connected-icon").css("left", iconLeft + "px");
                        $(".connected-icon").css("top", (posTop - 12) + "px");
                    }, 500);
                }
            });

            $(document).find('.ui-item').droppable({
                accept: '.con_anchor',
                drop: function (event, ui) {
                    var item = ui.draggable.closest('.ui-item');
                    var cName = $(this).attr("class").replace("ui-droppable-active", "").trim();
                    var conName = item.attr("class").replace("ui-droppable-active", "").trim();
                    if (!that.map[cName]) {
                        that.map[cName] = [];
                    }
                    if (!that.map[conName]) {
                        that.map[conName] = [];
                    }
                    if (that.map[cName].indexOf(conName) == -1 && that.map[conName].indexOf(cName) == -1) {
                        that.map[cName].push(conName);
                        that.map[conName].push(cName);
                    } else {
                        return;
                    }

                    $(this).data('connected-item', item);
                    ui.draggable.css({ top: (item.height() / 2) - 15, left: item.width() });
                    item.data('lines').push(item.data('line'));

                    if ($(this).data('connected-lines')) {
                        $(this).data('connected-lines').push(item.data('line'));
                        var y2_ = parseInt(item.data('line').attr('y2'));
                        item.data('line').attr('y2', y2_ + $(this).data('connected-lines').length * 5);
                    } else $(this).data('connected-lines', [item.data('line')]);

                    $(".connected-icon").css("display", "block");
                    let connector = $('#connector_canvas');
                    let cur_con = $(connector.find("line")[0]);
                    let posLeft = parseInt(cur_con.attr("x1"));
                    let posRight = parseInt(cur_con.attr("x2"));
                    let posTop = parseInt(cur_con.attr("y1"));
                    let posBottom = cur_con.attr("y2");
                    let iconLeft = posLeft + ((posRight - posLeft - (item.width() / 2)) / 2) + (item.width() / 2);

                    $(".connected-icon").css("left", iconLeft + "px");
                    $(".connected-icon").css("top", (posTop - 12) + "px");
                    item.data('line', null);
                    console.log('dropped');
                }
            });
            $(document).find('.con_anchor').draggable({
                containment: "#canvas",
                drag: function (event, ui) {
                    var _end = $(event.target).parent().position();
                    var end = $(event.target).position();
                    console.log(ui.helper.closest(".ui-item"));
                    if (_end && end)
                        $(event.target).parent().data('line')
                            .attr('x2', end.left + _end.left + 5).attr('y2', $(event.target).parent().height() / 2);
                },
                stop: function (event, ui) {
                    if (!ui.helper.closest('.ui-item').data('line')) return;
                    ui.helper.css({ top: ($(event.target).parent().height() / 2) - 15, left: $(event.target).parent().width() });
                    ui.helper.closest('.ui-item').data('line').remove();
                    ui.helper.closest('.ui-item').data('line', null);
                    console.log('stopped');
                }
            });
            $(document).find('.con_anchor').on('mousedown', function (e) {
                var cur_ui_item = $(this).closest('.ui-item');
                var connector = $('#connector_canvas');
                var cur_con;

                if (!$(cur_ui_item).data('lines')) $(cur_ui_item).data('lines', []);

                if (!$(cur_ui_item).data('line')) {
                    cur_con = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
                    cur_ui_item.data('line', cur_con);
                } else cur_con = cur_ui_item.data('line');

                connector.append(cur_con);
                var start = cur_ui_item.position();
                cur_con.attr('x1', start.left + ($(this).parent().width() / 2)).attr('y1', start.top + ($(this).parent().height() / 2));
                cur_con.attr('x2', start.left + 1).attr('y2', start.top + 1);
            });
        }, 500);
    }

    loadWrangleTables() {
        if (this.isWrangleTblsLoaded) {
            if (this.isWrangleTblsLoaded) {
                return;
            }
        }
        this.lineageService.fetchWrangleTables(this.tlevel).subscribe(response => {
            this.tableList = response["response"];
            this.isWrangleTblsLoaded = true;
        });
    }

    resetWrangle() {
        this.tbljoin = false;
        this.map = {};
        $("#connector_canvas").html("");
        $(".connected-icon").css("display", "none");
        this.list = [];
        this.previewWrangledData = {};
        this.showWrangledForm = true;
        this.joinData = {
            joinType: "Inner Join",
            firstCol: "",
            secondCol: "",
            firstTbl: "",
            secondTbl: ""
            
        };
        this.isSelectAll = {};
        this.showPreview=false;
    }
    resetUi(){
        this.joinData = {
            joinType: "Inner Join",
            firstCol: "",
            secondCol: "",
            firstTbl: "",
            secondTbl: ""
        };
    }
    removeUIItem(i) {
        this.tbljoin = false
        $(".connected-icon").css("display", "none");
        this.isSelectAll[this.list[i]["name"]] = false;
        this.list.splice(i, 1);
        $("#connector_canvas").html("");
        this.map = {};
        this.joinData = {
            joinType: "Inner Join",
            firstCol: "",
            secondCol: "",
            firstTbl: "",
            secondTbl: ""
        };
        
    }

    showLineage(flowId) {
        this.localflowid = flowId;
        this.lineageService.fetchLineage(flowId).subscribe((Response: any) => {
            if (Response.status == 200) {
                let data = Response.response;
                this.ngxGraph(data)
            }
            else {
                alert(Response.statusMessage);
            }
        }, error => {
            alert("Server error occured");
        })
    }

    ngxGraph(Response) {
        this.nodes = [];
        this.links = [];
        let that = this;
        function iterate(ind, data) {
            for (var i = 0; i < data.length; i++) {
                var prevMatch = false;
                for (var j = 0; j < that.nodes.length; j++) {
                    if (that.nodes[j].id == data[i].id) {
                        prevMatch = true;
                        let isLinkExist=false;
                        for(var k=0;k<that.links.length;k++){
                            if(that.links[k].source==that.nodes[ind].id&&that.links[k].target==that.nodes[j].id){
                                isLinkExist=true;
                            }
                        }
                        if(!isLinkExist){
                        that.links.push({ "source": that.nodes[ind].id, "target": that.nodes[j].id });
                        }
                        if (data[i].children && data[i].children.length > 0) {
                            iterate(j, data[i].children);
                        }
                        break;
                    }
                }
                if (!prevMatch) {
                    that.nodes.push({
                        "label": data[i].name, "id": data[i].id.toString(), "data": {
                            "nodeId": data[i].nodeId,
                             "type": data[i].type,
                            //  "bgColor": data[i].bgColor,
                            // "borderColor": data[i].borderColor,
                            "category": data[i].category,
                            "icon": Constants.fetchNodeByID(data[i].nodeId)['nodeImage']

                        },"dimension": {
                            "width": 50,
                            "height": 50
                        }
                    });
                    let isLinkExist=false;
                        for(var k=0;k<that.links.length;k++){
                            if(that.links[k].source==that.nodes[ind].id&&that.links[k].target==that.nodes[that.nodes.length - 1].id){
                                isLinkExist=true;
                            }
                        }
                        if(!isLinkExist){
                    that.links.push({ "source": that.nodes[ind].id, "target": that.nodes[that.nodes.length - 1].id });
                        }
                    if (data[i].children && data[i].children.length > 0) {
                        iterate(that.nodes.length - 1, data[i].children);
                    }
                }
               
            }
        }

        for (var i = 0; i < Response.length; i++) {
            this.nodes.push({
                "label": Response[i].name, "id": Response[i].id.toString(), "data": {
                    "nodeId": Response[i].nodeId,
                     "type": Response[i].type, 
                     "category": Response[i].category,
                    //  "bgColor": Response[i].bgColor,
                    // "borderColor": Response[i].borderColor,
                    "icon": Constants.fetchNodeByID(Response[i].nodeId)['nodeImage']
                },"dimension": {
                    "width": 50,
                    "height": 50
                }
            })
        }

        for (var i = 0; i < Response.length; i++) {
            if (Response[i].children && Response[i].children.length > 0) {
                iterate(i, Response[i].children);
            }
        }
    }

    setNodeDetails(d) {
        this.tname = d.label;
        this.tlevel = d.data.nodeId;
        this.lineageId = d.id;
        if(d.data.category == "data") {
            this.enableWrangle = true;
            this.enableScript = true;
        } else {
            this.enableWrangle = false;
            this.enableScript = true;
        }
    }

    getSubString(d) {
        if (d.length > 14) {
            return d.substr(0, 13) + "...";
        }
        return d;
    }

    WorkflowRedirect() {
        console.log("FLOWID:", this.flowId)
        console.log("--WorkflowRedirect()---", this.tname, this.tlevel, "tname--")
        this.router.navigate(['/wrangling'],
            { queryParams: { 'tname': this.tname, 'tlevel': this.tlevel, 'flowId': this.flowId,'lineageId': this.lineageId, 'projectName': this.projectName } });
    }

    scriptRedirect() {
        this.router.navigate(['/script'],
            { queryParams: { 'tname': this.tname, 'lineageId': this.lineageId, 'flowId': this.flowId,'projectName': this.projectName } });
    }

    executeQuery() {
        this.isDisableNewTable = false
        this.exutequeries.push(this.queryToExecute);
        let reqBody = {
            "task": "",
            "columnsList": this.getSelectedColumnsList(this.joinData["firstTbl"]).concat(this.getSelectedColumnsList(this.joinData["secondTbl"])),
            "tableColumnJoinTypeList": [
                {
                    "tableColumns": [
                        {
                            "sourceTableName1": this.joinData["firstTbl"],
                            "sourceColumnName1": this.joinData["firstCol"],
                            "sourceTableName2": this.joinData["secondTbl"],
                            "sourceColumnName2": this.joinData["secondCol"]
                        }
                    ],
                    "joinType": this.joinData["joinType"]
                }
            ],
            "selectedFlowId": this.flowId,
            "nodeTypeId": "25",
            "queryLogicParam": this.exutequeries
        }

        this.lineageService.fetchWrangle(reqBody).subscribe(response => {
            console.log("respose", response)
            this.previewWrangledData = response["response"];
            this.joinQuery = this.previewWrangledData["queryResponse"]

        })
    }
    createWrangledTable() {
        let reqBody = {
            "task": "",
            "newTableName": this.newTableName,
            "columnsList": this.getSelectedColumnsList(this.joinData["firstTbl"]).concat(this.getSelectedColumnsList(this.joinData["secondTbl"])),
            "tableColumnJoinTypeList": [
                {
                    "tableColumns": [
                        {
                            "sourceTableName1": this.joinData["firstTbl"],
                            "sourceColumnName1": this.joinData["firstCol"],
                            "sourceTableName2": this.joinData["secondTbl"],
                            "sourceColumnName2": this.joinData["secondCol"]
                        }
                    ],
                    "joinType": this.joinData["joinType"]
                }
            ],
            "selectedFlowId": this.flowId,
            "nodeTypeId": "25",
            "queryLogicParam": this.exutequeries
        }

        this.lineageService.createWrangledTable(reqBody).subscribe(response => {
            console.log("response", response)
            
        })
    }

    showNewWrangledTable() {
        this.showPreview = false;
        this.showcreateTable = true
    }
    goToPreview() {
        this.showPreview = true;
        this.showcreateTable = false;
    }
}