import { Component, ViewChild, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { VisulisationService } from './visulisation.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-visulisation',
  templateUrl: './visulisation.component.html',
  styleUrls: ['./visulisation.component.css']
})
export class VisulisationComponent implements OnInit {

  @ViewChild('aggDropdown', { static: false }) aggDropdown: ElementRef;
  tblLevelList: any;
  selectedTbl: string;
  columns: any
  columnName1 = [];
  mulitBarColumnName1 = [];
  columnName2 = [];
  selectedAggregation: string = ""
  selectedGraph: any = "discreteBarChart"
  selectedLevel: string;
  options: {};
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  tblName: string = '';
  PieChart: any;
  BarChart: any;
  labelData: any;
  valueData: any;
  showBarChart: boolean = true
  showPieChart: boolean = true
  showMultiBarChart: boolean = true
  displayCharts: boolean = false;
  myBarChart: Chart;
  myPieChart: Chart
  myMultiBarChart: Chart
  multiBarChartLabels = []
  multiBarChartDatasets = []
  dataValues = []
  xColumn: boolean = false
  yColumn: boolean = false;
  selectAgg: boolean = false;
  selectedFilter: string = "25";
  filterImgPath: string = "";
  postgresTables: any;
  sqlTables: any;
  hiveTables: any;
  numDtypes = ["int", "double", "float", "decimal", "num", "serial"];

  constructor(private VisulisationService: VisulisationService, private toastr: ToastrService, private renderer: Renderer2) { }

  ngOnInit() {
    this.fetchTables()
    this.dropdownSettings = {
      singleSelection: true,
      text: "Select table",
      primaryKey: "id",
      labelKey: "tblName",
      idField: 'jobs',
      textField: 'level1',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      maxHeight: 200,
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }

  selectColumns(table: any) {
    this.resetGraphFields();
    this.resetColumnFields();
    this.selectedLevel = table["level"]
    this.selectedTbl = table["tblName"]
    this.VisulisationService.stagingColumns(this.selectedTbl, this.selectedLevel).subscribe((Response: any) => {
      if (Response.status == 200) {
        this.columns = Response.response;
      } else if (Response.status == 404) {
        this.toastr.info("Columns do not exist for table !!");
      } else {
        this.toastr.error(Response.statusMessage);
      }
    }), error => {
      this.toastr.error("Something went wrong. Please try again");
    }
  }

  deSelectColumns() {
    this.resetGraphFields();
    this.resetColumnFields();
  }

  resetGraphFields() {
    this.showBarChart = false
    this.showPieChart = false
    this.showMultiBarChart = false
    this.columns = [];
    this.columnName1 = [];
    this.mulitBarColumnName1 = [];
    this.columnName2 = [];
    this.selectedAggregation = "";
    this.selectedGraph = "discreteBarChart";
  }

  showUpArrow() {
    var lineageDiv = this.aggDropdown.nativeElement;
    this.renderer.removeClass(lineageDiv, 'showDownArrow');
    this.renderer.addClass(lineageDiv, 'showUpArrow');
  }

  showDownArrow() {
    var lineageDiv = this.aggDropdown.nativeElement;
    this.renderer.removeClass(lineageDiv, 'showUpArrow');
    this.renderer.addClass(lineageDiv, 'showDownArrow');
  }

  fetchTables() {
    this.filterImgPath = Constants.fetchNodeByID(parseInt(this.selectedFilter))['nodeImage'];
    if (this.postgresTables != undefined && this.selectedFilter =='25') {
      this.tblLevelList = this.postgresTables
    }
    else if (this.sqlTables != undefined  && this.selectedFilter =='30') {
      this.tblLevelList = this.sqlTables
    }
    else if (this.hiveTables != undefined  && this.selectedFilter =='60') {
      this.tblLevelList = this.hiveTables
    }
    else{
      this.VisulisationService.fetchTables(this.selectedFilter).subscribe((Response: any) => {
        this.selectedItems = [];
        if (Response.status == 200) {
          if (Response["response"].length > 0) {
            this.tblLevelList = Response['response']
            for (let i = 0; i < this.tblLevelList.length; i++) {
              this.tblLevelList[i]["id"] = i + 1;
            }
            switch(this.selectedFilter)
            {
              case '25':
                this.postgresTables = this.tblLevelList
                break;
              case '30':
                this.sqlTables = this.tblLevelList
                break;
              case '60':
                this.hiveTables = this.tblLevelList
                break;
              default:
                break;
            }
          }
        } else if (Response.status == 404) {
          this.toastr.info("No table exsits!! Please ingest new table.")
        } else {
          this.tblLevelList = []
          this.toastr.error(Response.statusMessage);
        }
      }), error => {
        this.toastr.error("Something went wrong !! Please try again");
      }
    }
    
  }

  // isNumField function is for checkin whether a column datatype is numeric or not
  isNumField(dataType: string) {
    let isNumDtype = false;
    for (let i = 0; i < this.numDtypes.length; i++) {
      if (dataType.toLowerCase().includes(this.numDtypes[i])) {
        isNumDtype = true;
        break;
      }
    }
    return isNumDtype;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, columnName) {
    ev.dataTransfer.setData("text", columnName);
  }

  drop(ev) {
    if (this.selectedGraph != "multiBarChart") {

      if (this.columnName1.length < 1) {
        this.columnName1[this.columnName1.length] = ev.dataTransfer.getData("text");
        this.xColumn = false;
      }
      else if (this.columnName1.length >= 1) {
        return;
      }
    }
    else if (this.selectedGraph == "multiBarChart") {
      this.xColumn = true;
      if (this.columnName1.length <= 1) {
        this.xColumn = true;
        this.columnName1.push(ev.dataTransfer.getData("text"));
        this.xColumn = false;
      }
      else if (this.columnName1.length > 1) {
        this.xColumn = true
        return
      }
    }
  }

  drop1(ev) {
    if (this.columnName2.length <= 1) {
      this.yColumn = false
      this.columnName2 = ev.dataTransfer.getData("text")
      if (this.columnName2.length == 0) {
        this.yColumn = true;
      }
    }
    else if (this.columnName2.length > 1) {
      this.yColumn = true;
      return;
    }
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomColorEachLabel(count) {
    var data = [];
    for (var i = 0; i < count; i++) {
      data.push(this.getRandomColor());
    }
    return data;
  }

  publishGraph() {
    this.showBarChart = false
    this.showPieChart = false
    this.showMultiBarChart = false
    this.options = {};
    if (this.selectedGraph == 'multiBarChart') {
      if (this.columnName1.length == 2 && this.columnName2.length != 0 && this.selectedAggregation != "") {
        this.resetColumnFields();
        this.showMultiBarChart = true;
        this.showBarChart = false;
        this.showPieChart = false;
        let columnName1 = this.columnName1.join();
        this.VisulisationService.getChartDetails(this.selectedTbl, this.selectedLevel, columnName1, this.columnName2, this.selectedGraph, this.selectedAggregation).subscribe((Response: any) => {
          this.multiBarChartLabels = Response['response'].map(Response => Response.key)
          this.dataValues = Response['response'].map(Response => Response.values)
          var sublabels = [];
          for (var ind in this.dataValues) {
            for (var i = 0; i < this.dataValues[ind].length; i++) {
              if (sublabels.indexOf(this.dataValues[ind][i].x) < 0) {
                sublabels.push(this.dataValues[ind][i].x);
              }
            }
          }

          var datasets = []
          for (var i = 0; i < sublabels.length; i++) {
            datasets.push({
              "label": sublabels[i],
              "backgroundColor": this.getRandomColor(),
              "borderColor": "black",
              "borderWidth": 1,
              "data": []
            });
          }

          var dataMap = {};
          for (var ind in this.dataValues) {
            dataMap[ind] = {};
            for (var i = 0; i < this.dataValues[ind].length; i++) {
              dataMap[ind][this.dataValues[ind][i].x] = this.dataValues[ind][i].y;
            }
          }

          for (var i = 0; i < datasets.length; i++) {
            for (var ind in dataMap) {
              if (dataMap[ind][datasets[i].label]) {
                datasets[i].data.push(dataMap[ind][datasets[i].label]);
              } else {
                datasets[i].data.push(0);
              }
            }
          }
          this.multiBarChartDatasets = datasets
          this.chartData();
        })
      }
      else {
        if ((this.columnName1.length == 0 || this.columnName1.length == 1) && this.selectedAggregation != "") {
          this.xColumn = true
          this.selectAgg = false
        }
        if (this.columnName2.length == 0) this.yColumn = true;
        if (this.selectedAggregation == "") this.selectAgg = true;
      }
    }

    else {
      if (this.columnName1.length != 0 && this.columnName2.length != 0 && this.selectedAggregation != "") {
        if (this.selectedGraph == 'discreteBarChart') {
          this.showBarChart = true;
          this.showPieChart = false;
          this.showMultiBarChart = false;
        }
        if (this.selectedGraph == 'pieChart') {
          this.showPieChart = true;
          this.showBarChart = false;
          this.showMultiBarChart = false;
        }
        this.VisulisationService.getChartDetails(this.selectedTbl, this.selectedLevel, this.columnName1[0], this.columnName2, this.selectedGraph, this.selectedAggregation).subscribe((Response: any) => {
          if (Response.status == 200) {
            this.resetColumnFields();
            if (Response.response[0].values != undefined) {
              let label = Response.response[0].values.map(Response => Response.label)
              let value = Response.response[0].values.map(Response => Response.value)
              this.labelData = label;
              this.valueData = value
            }
            if (Response.response[0].values == undefined) {
              let label = Response['response'].map(Response => Response.label)
              let value = Response['response'].map(Response => Response.value)
              this.labelData = label;
              this.valueData = value
            }
            this.chartData();
          }
        })
      }
      else {
        if (this.columnName1.length == 0) this.xColumn = true;
        if (this.columnName1.length == 1) this.xColumn = false;
        if (this.columnName2.length == 0) this.yColumn = true;
        if (this.selectedAggregation == "") this.selectAgg = true
      }
    }
  }

  chartData() {
    if (this.selectedGraph == 'discreteBarChart') {
      if (this.myBarChart) {
        this.myBarChart.destroy();
      }

      const canvas = document.getElementById('discreteBarChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      this.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labelData,
          datasets: [{
            data: this.valueData,
            backgroundColor: this.getRandomColorEachLabel(this.labelData.length),
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              ticks: {
                userCallback: function (label) {
                  if (label.length >= 5)
                    return label.slice(0, 5) + "...";
                  else
                    return label;
                }
              },
              scaleLabel: {
                display: true,
                labelString: this.columnName1,
                fontStyle: 'bold'
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.selectedAggregation + " (" + this.columnName2 + ")",
                fontStyle: 'bold'
              },
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
    else if (this.selectedGraph == 'multiBarChart') {
      if (this.myMultiBarChart) {
        this.myMultiBarChart.destroy();
      }
      var barChartData = {
        labels: this.multiBarChartLabels,
        datasets: this.multiBarChartDatasets
      };

      var chartOptions = {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: this.columnName1[0]
        },
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 5) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: this.columnName1[1],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.selectedAggregation + " (" + this.columnName2 + ")",
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
      const canvas = document.getElementById('multiBarChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      this.myMultiBarChart = new Chart(ctx, {
        type: "bar",
        data: barChartData,
        options: chartOptions
      });
    }
    else if (this.selectedGraph == 'pieChart') {
      if (this.myPieChart) { this.myPieChart.destroy(); }
      const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      this.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.labelData,
          datasets: [
            {
              label: this.labelData,
              data: this.valueData,
              backgroundColor: this.getRandomColorEachLabel(this.labelData.length),
              borderWidth: 0,
              fill: true
            },
          ]
        },
        options: {
          responsive: true,
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pie Chart'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          },
          tooltips: {
            enabled: true,
            mode: 'nearest'
          }
        }
      });

    }
  }

  closeColumnX(i) {
    this.xColumn = false
    if (this.selectedGraph != "multiBarChart") {
      this.xColumn = true;
      this.columnName1 = []
    }
    else if (this.selectedGraph == "multiBarChart") {
      this.xColumn = true
      this.columnName1.splice(i, 1);
    }
  }

  closeColumnY(i) {
    this.columnName2 = []
    if (this.columnName2.length == 0) {
      this.yColumn = true
    }

  }

  changeChart() {
    this.columnName1.splice(1, 1);
    this.selectingGraph();
  }

  resetColumnFields() {
    this.xColumn = false
    this.yColumn = false
    this.selectAgg = false
  }

  selectingGraph() {
    if (this.columnName1.length || this.columnName2.length) {
      if (this.selectedGraph == "discreteBarChart" || this.selectedGraph == "pieChart") {
        this.showBarChart = false
        this.showPieChart = false
        this.showMultiBarChart = false
        if (this.columnName1.length == 0) this.xColumn = true;
        if (this.columnName1.length == 1) this.xColumn = false;
        if (this.columnName2.length == 0) this.yColumn = true;
        if (this.selectedAggregation == "") this.selectAgg = true;
        if (this.selectedAggregation != "") this.selectAgg = false
      }
      else if (this.selectedGraph == "multiBarChart") {
        this.showBarChart = false
        this.showPieChart = false
        this.showMultiBarChart = false
        if (this.columnName1.length == 0 || this.columnName1.length == 1) this.xColumn = true;
        if (this.columnName2.length == 0) this.yColumn = true;
        if (this.selectedAggregation == "") this.selectAgg = true;
        if (this.selectedAggregation != "") this.selectAgg = false;
      }
    }
  }

  selectAggregation() {
    if (this.selectedAggregation != "") this.selectAgg = false
  }

}
