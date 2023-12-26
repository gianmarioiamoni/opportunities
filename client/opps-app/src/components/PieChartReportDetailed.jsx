// PieChartReportDetailed.jsx
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { getReportsOpportunitiesDetailed } from '../services/opportunityService';

export default function PieChartReportDetailed() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        getReportsOpportunitiesDetailed()
            .then(dataArr => {

                if (dataArr === null)
                    return;

                console.log("dataArr = " + JSON.stringify(dataArr));

                const dataValues = [];
                const labelsValues = [];

                dataArr.forEach(dataObj => {
                    labelsValues.push(dataObj.status);
                    dataValues.push(dataObj.count);
                });

                const documentStyle = getComputedStyle(document.documentElement);
                const data = {
                    // labels: ['WON', 'LOST', 'OPEN'],
                    labels: [...labelsValues],
                    datasets: [
                        {
                            // data: [
                            //     dataArr[0].statusWonCount,
                            //     dataArr[0].statusLostCount,
                            //     dataArr[0].statusOpenCount
                            // ],
                            data: [...dataValues],
                            backgroundColor: [
                                documentStyle.getPropertyValue('--blue-500'),
                                documentStyle.getPropertyValue('--yellow-500'),
                                documentStyle.getPropertyValue('--green-500'),
                                documentStyle.getPropertyValue('--red-500'),
                                documentStyle.getPropertyValue('--pink-500'),
                                documentStyle.getPropertyValue('--purple-500'),
                            ],
                            hoverBackgroundColor: [
                                documentStyle.getPropertyValue('--blue-400'),
                                documentStyle.getPropertyValue('--yellow-400'),
                                documentStyle.getPropertyValue('--green-400'),
                                documentStyle.getPropertyValue('--red-400'),
                                documentStyle.getPropertyValue('--pink-400'),
                                documentStyle.getPropertyValue('--purple-400'),
                            ]
                        }
                    ]
                }
                const options = {
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true
                            }
                        }
                    },
                    maintainAspectRatio: false
                };

                setChartData(data);
                setChartOptions(options);

                return dataArr;
            })
            .catch(err => console.log(err))
            
    }, []);

    return (
        <div className="chart-container card flex flex-column justify-content-center align-items-start gap-3">
            <label className="font-bold block mb-2">Opportunities Detailed Statistics</label>
            <div>
                <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" style={{ margin: "5px 0" }} />
            </div>
        </div>
    )
}