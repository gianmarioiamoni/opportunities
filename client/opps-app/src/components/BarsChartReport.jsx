// BarsChartReport.jsx

import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { getReportsOpportunitiesPerSectors } from '../services/opportunityService';

export default function BarsChartReport() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        getReportsOpportunitiesPerSectors()
            .then(dataArr => {
                console.log("BarsChartReport");
                console.log("dataArr = " + JSON.stringify(dataArr));

                if (dataArr === null)
                    return;

                const dataValues = [];
                const labelsValues = [];

                dataArr.forEach(dataObj => {
                    labelsValues.push(dataObj.sector);
                    dataValues.push([dataObj.statusWonSum, dataObj.statusLostSum, dataObj.statusOpenSum]);
                });

                console.log("dataValues = " + JSON.stringify(dataValues));

                // transpose dataValues
                const transpDataValues = dataValues[0].map((col, i) => dataValues.map(row => row[i]));
                console.log("transpDataValues = " + JSON.stringify(transpDataValues));
                
                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');
                const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                const data = {
                    labels: [...labelsValues],
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Won',
                            backgroundColor: documentStyle.getPropertyValue('--green-500'),
                            data: [...transpDataValues[0]]
                        },
                        {
                            type: 'bar',
                            label: 'Lost',
                            backgroundColor: documentStyle.getPropertyValue('--red-500'),
                            data: [...transpDataValues[1]]
                        },
                        {
                            type: 'bar',
                            label: 'Open',
                            backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                            data: [...transpDataValues[2]]
                        }
                    ]
                };
                const options = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        tooltips: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder
                            }
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                color: textColorSecondary
                            },
                            grid: {
                                color: surfaceBorder
                            }
                        }
                    }
                };

                setChartData(data);
                setChartOptions(options);
            })
        .catch(err => console.log("failed to get report: " + err))
        
    }, []);

    return (
        <div className="chart-container card flex flex-column justify-content-center align-items-start gap-3">
            <label className="font-bold block mb-2">Opportunities per Sector</label>
            <div>
                <Chart type="bar" data={chartData} options={chartOptions} />
            </div>
        </div>
    )
}
