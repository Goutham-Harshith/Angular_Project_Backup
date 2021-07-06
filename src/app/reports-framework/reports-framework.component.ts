import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ReportsDashboardService } from './reports-framework.service';
import { ShortNumberPipe } from '../pipes/short-number.pipe';
import { Chart } from 'chart.js';
import * as ChartGeo from "chartjs-chart-geo";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports-framework',
  templateUrl: './reports-framework.component.html',
  styleUrls: ['./reports-framework.component.css']
})
export class ReportsFrameworkComponent implements OnInit {

  @ViewChild('MainCards', { static: false }) mainCards: ElementRef;

  constructor(private reportsDashboardService: ReportsDashboardService, private shortNumPipe: ShortNumberPipe, private route: ActivatedRoute) { }

  reportTitle : string;
  pageCode: string;
  reportCode: string;
  // cardNames will be used later to generate allCard 
  cardNames = [];
  filters = [];
  dropdownSingle = { singleSelection: true, text: "Select values", maxHeight: 200, enableSearchFilter: true, classes: "custom-class custom-class", badgeShowLimit: 1 };
  dropdownMulti = { text: "Select values", maxHeight: 200, enableSearchFilter: true, classes: "custom-class", badgeShowLimit: 1 };
  allFilterData: FilterData[] = [];
  allCard: Card[] = [];
  tableData = [];
  allGraphData = [];
  allTableData = [];
 

  showArrow: boolean = false;
  p: number[] = [];
  pageSize: number[] = [];
  disableButton: boolean = false;

  ngOnInit() {
    this.route.queryParamMap.subscribe((res) => {
      this.reportTitle = res['params'].title;
      this.pageCode = res['params'].pageCode;
      this.reportCode = res['params'].reportCode;
      this.reportsDashboardService.getElementsByReportCode(this.pageCode, this.reportCode).subscribe((response) => {
        this.allFilterData = [];
        this.filters = [];
        this.allTableData = [];
        this.allGraphData = [];
        this.allCard = [];
        this.cardNames = [];
        let filterData = response['response'].filters;
        filterData.forEach((data)=>
        {
          let body = 
          {
            "filterName": data.filterName,
            "filterLabel" : data.filterName,
            "filterType" : data.filterType,
            "dependant" : false
          }
          this.filters.push(body);
        })
        let tableData = response['response'].tabular;
        tableData.forEach((data) => {
          let body =
          {
            "tableName": data.tableName,
            "data": []
          }
          this.allTableData.push(body);
        })

        let graphData = response['response'].graphs;
        graphData.forEach((data) => {
          let body =
          {
            "graphName": data.graphName,
            "masterGraphData": {},
            "chart": null
          }
          this.allGraphData.push(body);
        })

        let cardData = response['response'].cards;
        cardData.forEach((data) => {
          let body =
          {
            "cardLabel": data.cardName,
            "cardName": data.cardName
          }
          this.cardNames.push(data.cardName);
          this.allCard.push(body);
        })

        this.cardNames.forEach((card, index) => {
          let obj: Card = {
            cardLabel: card,
            cardName: card,
            subCard: []
          };
          obj.cardLabel = card;
          obj.cardLabel = card;
          obj.subCard = [];
          this.fetchSubCard(index, {});
        });
  
        this.allTableData.forEach((table, index) => {
          this.pageSize[index] = 10;
          this.fetchTable(table.tableName, index, {});
        });

        this.filters.forEach(filter => {
          var item: FilterData;
          item = { "filterName": filter.filterName, "dependant": filter.dependant, "filterLabel": filter.filterLabel, filterType: filter.filterType };
          if (filter.filterType == "Date") {
            item["from"] = "";
            item["to"] = "";
          } else if (filter.filterType !== "Date") {
            item["filterSelData"] = [];
            item["filterData"] = [];
          }
          this.allFilterData.push(item);
        });
  
        this.allFilterData.forEach((filter, index) => {
          if (filter.filterType.includes("Date")) {
          } else {
             this.fetchFilterValues(index, filter.filterName, filter.filterType);
          }
        });
  
        this.allGraphData.forEach(graph => {
          this.fetchCharts(graph.graphName, {});
        });

      })
     

    })
  }

  scrollCard(direction: string) {
    if (direction == "right") {
      this.mainCards.nativeElement.scrollTo({ left: (this.mainCards.nativeElement.scrollLeft + 150), behavior: 'smooth' });
    } else {
      this.mainCards.nativeElement.scrollTo({ left: (this.mainCards.nativeElement.scrollLeft - 150), behavior: 'smooth' });
    }
  }

  fetchFilterValues(index: number, filterName: string, filterType: string, body = {}) {
    this.reportsDashboardService.getFilterData2("filters", this.pageCode, this.reportCode, filterName, body).subscribe((Response: any) => {
      if (filterType == "Text") {
        var data = [];
        Response.response.forEach((obj, i) => {
          var item: AutoCompleteValues;
          item = { "id": i + 1, "itemName": obj };
          data.push(item);
        });
      }
      if (filterType == "Number") {
        this.allFilterData[index].from = Response.response[0];
        this.allFilterData[index].to = Response.response[Response.response.length - 1];
      }

      var selectedData = [];
      this.allFilterData.forEach(filter => {
        if ((filter.filterName == filterName) && (filter.filterType == "Text")) {
          filter.filterData = data;
          var removeElements = [];
          if (filter.filterSelData.length > 0) {
            filter.filterSelData.forEach(element => {
              if (this.checkObject(data, element) == -1) {
                removeElements.push(element);
              }
            });
          }
          removeElements.forEach(element => {
            for (let i = 0; i < filter.filterSelData.length; i++) {
              if (filter.filterSelData[i].itemName == element.itemName) {
                filter.filterSelData.splice(i, 1);
                break;
              }
            }
          });
          filter.filterSelData.forEach(element => {
            for (let i = 0; i < filter.filterData.length; i++) {
              if (element.itemName == filter.filterData[i].itemName) {
                element.id = filter.filterData[i].id;
                break;
              }
            }
          });
        } else if ((filter.filterName == filterName) && (filter.filterType == "Number")) {

        }
      });
    })
  };

  fetchSubCard(index: number, body: {}) {
    this.reportsDashboardService.getFilterData2("cards", this.pageCode, this.reportCode, this.cardNames[index], body).subscribe((Response: any) => {
      this.allCard[index].subCard = [];
      let res = Response.response;
      res.forEach(obj => {
        let subCard: SubCard = {
          subCardLabel: obj["key"],
          subCardName: obj["key"],
          subCardValue: obj["value"],
          suffix: "",
        };
        this.allCard[index].subCard.push(subCard);
      });
    })
  }

  fetchTable(tableName: string, index: number, body: {}) {
    body["size"] = 200;
    body["page"] = 1;
    this.reportsDashboardService.getFilterData2("tabularData", this.pageCode, this.reportCode, tableName, body).subscribe((Response: any) => {
      this.allTableData[index].data = Response.response;
    })
  }

  applyFilter() {
    var body = this.createRequestBody();
    this.allGraphData.forEach(graph => {
      this.fetchCharts(graph.graphName, body);
    });
    this.allTableData.forEach((table, index) => {
      this.fetchTable(table.tableName, index, body);
    });
    this.allCard.forEach((card, index) => {
      this.fetchSubCard(index, body);
    });
  }

  refreshFilters(filterName: string, event: any) {
    this.disableButton=false;
    var body = this.createRequestBody();
    this.allFilterData.forEach((filter, index) => {
      var body = this.createRequestBody(index);
      if ((filter.filterName != filterName) && (filter.filterType === "Text")) {
        var filterBody = JSON.parse(JSON.stringify(body));
        delete filterBody["selectFilters"][filter.filterName];
        this.fetchFilterValues(index, filter.filterName, filter.filterType, filterBody);
      } else if ((filter.filterName != filterName) && (filter.filterType === "Number")) {
        this.fetchFilterValues(index, filter.filterName, filter.filterType, body);
      }
    })
  }

  resetFilters() {
    this.disableButton = false;
    this.allCard = [];
    this.cardNames.forEach((card, index) => {
      let obj :Card = {
        cardLabel : card,
        cardName : card,
        subCard  : []
      };
      obj.cardLabel = card;
      obj.cardLabel = card;
      obj.subCard = [];
      this.allCard.push(obj);
      this.fetchSubCard(index, {});
    });

    this.allTableData.forEach((table, index) => {
      table.data = [];
      this.pageSize[index] = 10;
      this.fetchTable(table.tableName, index, {});
    });

    this.allFilterData = [];
    this.filters.forEach(filter => {
      var item: FilterData;
      item = { "filterName": filter.filterName, "dependant": filter.dependant, "filterLabel": filter.filterLabel,filterType:filter.filterType };
      if(filter.filterType == "date") {
        item["from"] = "";
        item["to"] = "";
      } else if (filter.filterType !== "date") {
        item["filterSelData"] = [];
        item["filterData"] = [];
      }
      this.allFilterData.push(item);
    });

    this.allFilterData.forEach((filter, index) => {
      if (filter.filterType.includes("date")) {
      } else {
        this.fetchFilterValues(index, filter.filterName, filter.filterType);
      }
    });

    this.allGraphData.forEach(graph => {
      if(graph.chart.chart) {
        graph.chart.destroy();
      };
      graph.masterGraphData = {};
      this.fetchCharts(graph.graphName, {});
    });
  }


  async fetchCharts(graphName: string, body: {}) {
    this.reportsDashboardService.getFilterData2("charts", this.pageCode, this.reportCode, graphName, body).subscribe((Response: any) => {
      for (let i = 0; i < this.allGraphData.length; i++) {
        if (this.allGraphData[i].graphName == graphName) {
          this.allGraphData[i].masterGraphData = Response.response;
          break;
        }
      }
      setTimeout(function () {
        this.allGraphData.forEach((graph, index) => {
          this.plotChart(graph["masterGraphData"], index);
        });
      }.bind(this), 0);
    }), error => {
      for (let i = 0; i < this.allGraphData.length; i++) {
        if (this.allGraphData[i].graphName == graphName) {
          this.allGraphData[i].masterGraphData = {};
          break;
        }
      }
    }
  }

  plotChart(graphData: any, index: number) {
    switch (graphData["chartType"]) {
      case "Vertical bar chart":
        this.plotBarGraph(graphData, index);
        break;
      case "Horizontal bar chart":
        this.plotHorizontalBarGraph(graphData, index);
        break;
      case "Line Chart":
        this.plotLineGraph(graphData, index);
        break;
      case "Pie Chart":
        this.plotPieChart(graphData, index);
        break;
      case "Scatter Plot":
        this.plotScatterChart(graphData,index);
        break;
      case "Geographical Map":
        this.allGraphData[index].masterGraphData = {};
        return;
        this.geoMap(graphData, index);
        break;
    }
  }

  async geoMap(graphData: any, index: number) {
    fetch('https://unpkg.com/world-atlas/countries-50m.json').then((r) => r.json()).then((data) => {
      const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;

      const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      var labels = [];
      labels = graphData["reportingFrameworkDto"].map(obj => { return obj["x"] });
      var info = [];

      for (let i = 0; i < labels.length; i++) {
        var foundLabel = false;
        if (!foundLabel) {
          for (let j = 0; (j < countries.length) && (!foundLabel); j++) {
            if (countries[j].properties.name.toLowerCase() == labels[i].toLowerCase()) {
              foundLabel = true;
              var ele = {};
              ele = { feature: countries[j], value: graphData["reportingFrameworkDto"][i]["y"][0] };
              info.push(ele);
            }
          }
        }
      }

      const chart = new Chart(ctx, {
        type: 'choropleth',
        data: {
          labels: labels,
          datasets: [{
            label: 'Countries',
            data: info,
          }]
        },
        options: {
          showOutline: true,
          showGraticule: true,
          plugins: {
            legend: {
              display: false
            },
          },
          scales: {
            xy: {
              projection: 'equalEarth'
            }
          }
        }
      });
    });
  }

  plotBarGraph(graphData: any, index: number, horizontal = false) {
    let type = "bar";
    if (horizontal) {
      type = "horizontalBar";
    }
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      data.push(parseInt(obj["y"][0]));
      if(obj["x"] == null) {
        labelData.push("NULL");
      } else {
        labelData.push(obj["x"]);
      }
    });
    this.allGraphData[index].chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          data: data,
          backgroundColor: "#597c92",
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return this.shortNumPipe.transform(parseInt(tooltipItem.value.toString()));
            }.bind(this)
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 10) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: graphData["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: graphData["yAxisName"],
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              callback: function (data) {

                return this.shortNumPipe.transform(parseInt(data.toString()));
              }.bind(this)
            }
          }]
        }
      }
    });

  }

  plotHorizontalBarGraph(graphData: any, index: number) {
    let type = "horizontalBar";
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      data.push(parseInt(obj["x"]));
      labelData.push(obj["y"][0]);
    });
   
    this.allGraphData[index].chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          data: data,
          backgroundColor: "#597c92",
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return this.shortNumPipe.transform(parseInt(tooltipItem.value.toString()));
            }.bind(this)
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              callback: function (data) {
                return this.shortNumPipe.transform(parseInt(data.toString()));
              }.bind(this)

            },
            scaleLabel: {
              display: true,
              labelString: graphData["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: graphData["yAxisName"],
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 10) + "...";
                else
                  return label;
              }
            }
          }]
        }
      }
    });
  }

  plotLineGraph(graphData: any, index: number) {
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      data.push(parseInt(obj["y"][0]));
      if(obj["x"] == null) {
        labelData.push("NULL");
      } else {
        labelData.push(obj["x"]);
      }

      // data.push(parseInt(obj["y"][0]));
      // labelData.push(obj["x"]);
    });
    this.allGraphData[index].chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labelData,
        datasets: [{
          data: data,
          backgroundColor: "#597c92",
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
        }]
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return this.shortNumPipe.transform(parseInt(tooltipItem.value.toString()));
            }.bind(this)
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 10) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: graphData["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: graphData["yAxisName"],
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              callback: function (data) {

                return this.shortNumPipe.transform(parseInt(data.toString()));
              }.bind(this)
            }
          }]
        }
      }
    })
  }

  plotPieChart(graphData: any, index: number) {
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      data.push(parseInt(obj["y"][0]));
      if(obj["x"] == null) {
        labelData.push("NULL");
      } else {
        labelData.push(obj["x"]);
      }
      // data.push(parseInt(obj["y"][0]));
      // labelData.push(obj["x"]);
    });
    this.allGraphData[index].chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labelData,
        datasets: [{
          data: data,
          backgroundColor: this.getRandomColorEachLabel(labelData.length),
          borderWidth: 0,
          fill: true
        }]
      },
      options: {
        fill: false,
        pointRadius: 0,
        layout: {
          padding: {
            left: 0,
            right: 0,
            // top: 20,
            bottom: 20
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          enabled: true,
        },
        legend: {
          display: true,
          position: 'top',
        },
        maintainAspectRatio: false,
        animation: {
          animateScale: true,
          animateRotate: true
        },
      }
    });

  }

  plotScatterChart(graphData: any, index: number) {
    let type = "scatter";
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      let body = 
      {
        "x" : obj["x"],
        "y" : parseInt(obj["y"][0])
      }
      data.push(body);
       labelData.push(obj["x"]);
    });
    this.allGraphData[index].chart = new Chart(ctx, {
      type: type,
      data: {
        datasets: [{
          data: data,
          backgroundColor: "#597c92",
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return this.shortNumPipe.transform(parseInt(tooltipItem.value.toString()));
            }.bind(this)
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 10) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: graphData["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: graphData["yAxisName"],
              fontStyle: 'bold'
            },
            ticks: {
              callback: function (data) {
                return this.shortNumPipe.transform(parseInt(data.toString()));
              }.bind(this)

            },
            
          }]
        }
      }
    });

  }

  plotMultiBarGraph(graphData: any, index: number, horizontal = false) {
    let type = "bar";
    if (horizontal) {
      type = "horizontalBar";
    }
    if (this.allGraphData[index].chart) {
      this.allGraphData[index].chart.destroy();
    }
    const canvas = document.getElementById('graph_' + graphData.graphName) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    var data = [];
    var labelData = [];
    graphData["reportingFrameworkDto"].forEach(obj => {
      data.push(parseInt(obj["y"][0]));
      if(obj["x"] == null) {
        labelData.push("NULL");
      } else {
        labelData.push(obj["x"]);
      }
      // data.push(parseInt(obj["y"][0]));
      // labelData.push(obj["x"]);
    });
    this.allGraphData[index].chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          data: data,
          backgroundColor: "#597c92",
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: graphData["graphName"].toUpperCase(),
          fontStyle: "bold",
          fontSize: 16
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (tooltipItem) {
              return this.shortNumPipe.transform(parseInt(tooltipItem.value.toString()));
            }.bind(this)
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              userCallback: function (label) {
                if (label.length >= 5)
                  return label.slice(0, 10) + "...";
                else
                  return label;
              }
            },
            scaleLabel: {
              display: true,
              labelString: graphData["xAxisName"],
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: graphData["yAxisName"],
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true,
              callback: function (data) {
                return this.shortNumPipe.transform(parseInt(data.toString()));
              }.bind(this)
            }
          }]
        }
      }
    });
  }

  getRandomColorEachLabel(count) {
    var data = [];
    for (var i = 0; i < count; i++) {
      data.push(this.getRandomColor());
    }
    return data;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getFilterIndex(filterName: string) {
    var index;
    for (let i = 0; i < this.allFilterData.length; i++) {
      if (this.allFilterData[i].filterName == filterName) {
        index = i;
        break;
      }
    }
    return index
  }

  getCardIndex(cardName: string) {
    for (let i = 0; i < this.allCard.length; i++) {
      if (this.allCard[i].cardName == cardName) {
        return i
      }
    }
  }

  createRequestBody(index ?: number) {
    var body = { "selectFilters": {}, "rangeFilters": {} };
    this.allFilterData.forEach((element, i) => {
      if (index != i) {
        if (element.filterType == "Text") {
          if (element.filterSelData.length > 0) {
            var selectedValues;
            var variableName;
            if (element.filterName.toLowerCase().includes("date")) {
              selectedValues = this.calcMonths(element.filterSelData[0].itemName);
            } else {
              selectedValues = element.filterSelData.map(element2 => { return element2["itemName"] });
            }
            variableName = element.filterName;
            body.selectFilters[variableName] = selectedValues
          }
        } else {
          if (element.from) {
            if (element.filterType == "Number") {
              body.rangeFilters[element.filterName] = { "start": element.from, "end": element.to }
            } else if (element.filterType == "Date") {
              body.rangeFilters[element.filterName] = { "start": element.from + "T00:00:00.000+0000", "end": element.to + "T00:00:00.000+0000" }
            }
          }
        }
      }
    });
    return body
  }

  calcMonths(duration: string) {
    var iteration: number;
    var monthYearArr = [];
    switch (duration) {
      case ("last 6 months"):
        iteration = 6;
        break;
      case ("last 12 Months"):
        iteration = 12;
        break;
      case ("last 24 months"):
        iteration = 24;
        break;
      default:
        return;
    }
    var todayDate = new Date();
    for (let i = 0; i < iteration; i++) {
      var strMnthYear;
      strMnthYear = (todayDate.getMonth() + 1) + "." + todayDate.getFullYear();
      monthYearArr.push(strMnthYear);
      todayDate.setMonth(todayDate.getMonth() - 1);
    }
    return monthYearArr;
  }


  checkObject(list: AutoCompleteValues[], object: AutoCompleteValues) {
    var index;
    index = list.findIndex((item: AutoCompleteValues) => item.itemName == object.itemName);
    return index;
  }
}

export interface AutoCompleteValues {
  id: number;
  itemName: string;
}

export interface FilterData {
  filterName: string;
  filterLabel: string;
  filterType: string;
  dependant?: boolean;
  filterData?: AutoCompleteValues[];
  filterSelData?: AutoCompleteValues[];
  from?: string;
  to?: string;
}

export interface SubCard {
  subCardLabel: string
  subCardName: string
  subCardValue: number
  suffix: string
}

export interface Card {
  cardLabel: string
  cardName: string
  subCard?: SubCard[]
}

export interface graph {
  graphName: string
  masterGraphData: any
  chart: Chart
}
