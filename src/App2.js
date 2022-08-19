import React,{useEffect, useState} from "react";
// import "./styles.css";
import { Formik, FieldArray,Form } from "formik";
// import Data from './services/resource.json'  
import { API } from "./services/Api";
import Button from './components/Button';

// let categories = []

export const FormExample = ({categories,groupByCategory}) => (
  <Formik initialValues={{ categorylist: [] }} onSubmit={async (values) => {
    alert(JSON.stringify(values, null, 2));
}}>
    {({ values }) => {
      // console.log(values,categories,groupByCategory);
       return (
      <Form>
        <div className="hahaha">
          <FieldArray name="categorylist">
            {(arrayHelpers) => {
              return (
                <div className="huhuhu">
                  {Object.entries(groupByCategory).map((categoryRow, index) => {
                    // console.log(categoryRow);
                    // debugger
                    const groupData=categoryRow[0]!='other'?groupByCategory[categories[categoryRow[0]]?.id]:groupByCategory['other'];
                    const arr = values?.categorylist?.filter(id=>groupData.filter(g=>id==g.id)?.length>0)
            
                    // const arr = values.categorylist.filter(
                    //   (category) => {
                    //     console.log(category);
                    //     // debugger
                    //     return category === categoryRow[0];
                    //   });

                    return (
                      <div key={index} className="hihihi">
                        <label className="myinput">
                          {" "}
                          {categoryRow[0]}
                          <input
                            name={"categoryRow" + categoryRow[0]}
                            type="checkbox"
                            value={index}
                            checked={arr.length === categoryRow[1].length}
                            onChange={(e) => {
                              e.checked = true;
                              if (e.target.checked) {
                                categoryRow[1].forEach(key=>{
                                  // if (categoryRow[1].hasOwnProperty(key)) {
                                    // const element = categoryRow[1][key];
                                    const idx = values.categorylist.findIndex(
                                      (category) => category === key.id
                                    );
                                    idx === -1 && arrayHelpers.push(key.id);
                                  // }
                                })
                              } else {
                                categoryRow[1].forEach(key => {
                                  // if (categoryRow[1].hasOwnProperty(key)) {
                                    // const element = categoryRow[1][key];
                                    console.log(values.categorylist)
                                    const idx = values.categorylist.findIndex(
                                      (category) => category === key.id
                                    );
                                    console.log(idx)
                                    arrayHelpers.remove(idx);
                                  // }
                                })
                              }
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>

                        <FieldArray name="categorylist">
                          {(arrayHelpers) => {
                            return (
                              <div className="ahuhu">
                                {categoryRow[1].map((cateItem) => {
                                  return (
                                    <label
                                      key={cateItem.id}
                                      className="myinput"
                                    >
                                      {" "}
                                      {cateItem.name}
                                      <input
                                        name="categoryItems"
                                        type="checkbox"
                                        value={cateItem.id}
                                        checked={
                                          values.categorylist?.findIndex(
                                            (category) =>
                                              category === cateItem.id
                                          ) !== -1
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked)
                                            arrayHelpers.push(cateItem.id);
                                          else {
                                            const idx = values.categorylist.findIndex(
                                              (category) =>
                                                category === cateItem.id
                                            );
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  );
                                })}
                              </div>
                            );
                          }}
                        </FieldArray>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </FieldArray>
          <Button type='submit'> Add Tax to {values?.categorylist?.length} Item(s)</Button>
        </div>
        </Form>
       );
    }}
  </Formik>
);

export default function App() {
  const [data,setData] = useState([])
  const [categories,setCategories] = useState({})
  const [groupByCategory,setGroupByCategory] = useState({})

  useEffect(()=>{
    fetchData()
  },[])
  useEffect(()=>{
    categorize()
},[data])

const fetchData =async()=>{
    const data = await API.getData();
    setData(data)
    // console.log(data)
}

const categorize=()=>{
    const category = {};
    const groupByCategory ={};
    data.forEach(item=>{
        if(item.category){
            category[item?.category?.id]=(item.category);
        }
        if(item.category){
            if(groupByCategory[item.category.id]) groupByCategory[item.category.id].push(item);
            else {
                groupByCategory[item.category.id]=[item];
            }
        }else {
            if(groupByCategory["other"]) groupByCategory["other"].push(item);
            else {
                groupByCategory["other"]=[item];
            }
        }
    });
    setCategories(category)
    setGroupByCategory(groupByCategory)
}

  // let categories = [];
  // categories = Object.entries(data);
 console.log(data)
  return (
    <div className="App">
     {groupByCategory && categories?<FormExample groupByCategory={groupByCategory} categories={categories} />:null}
    </div>
  );
}
