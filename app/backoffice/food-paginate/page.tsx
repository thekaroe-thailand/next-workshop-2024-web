'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";

export default function FoodPaginate() {
    const [foods, setFoods] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (page: number = 1) => {
        try {
            const payload = {
                page: page,
                itemsPerPage: itemsPerPage
            }

            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(config.token)
            }

            const res = await axios.post(config.apiServer + '/api/food/paginate', payload, { headers });
            setFoods(res.data.results);
            setTotalPage(res.data.totalPage);
            setTotalItems(res.data.totalItems);
        } catch (e: any) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const changePage = (page: number) => {
        if (page > 0 && page <= totalPage) {
            setCurrentPage(page);
            fetchData(page);

        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">รายการอาหาร</div>
            <div className="card-body">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ชื่ออาหาร</th>
                            <th className="text-end" style={{ width: '100px' }}>ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((food: any) => (
                            <tr>
                                <td>{food.name}</td>
                                <td className="text-end">{food.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-2">
                    <div>จำนวนรายการ: {totalItems} จำนวนหน้า: {totalPage}</div>
                </div>

                <div className="mt-2">
                    <button disabled={currentPage === 1} className="btn btn-primary me-1" onClick={() => changePage(1)}>
                        <i className="fa fa-chevron-left me-2"></i>หน้าแรก
                    </button>
                    <button className="btn btn-primary me-1" onClick={() => changePage(currentPage - 1)}>
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    {Array.from({ length: totalPage }, (_, index) => (
                        <button
                            key={index}
                            disabled={currentPage === index + 1}
                            className={`btn btn-primary me-1 ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => changePage(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPage} className="btn btn-primary me-1" onClick={() => changePage(currentPage + 1)}>
                        <i className="fa fa-chevron-right"></i>
                    </button>
                    <button disabled={currentPage === totalPage} className="btn btn-primary" onClick={() => changePage(totalPage)}>
                        <i className="fa fa-chevron-right me-2"></i>หน้าสุดท้าย
                    </button>
                </div>
            </div>
        </div>
    )
}
