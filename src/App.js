import React,{useEffect,useState} from 'react'
import { Formik, Field,FieldArray, Form,ErrorMessage } from 'formik';
import Button from './components/Button';
import {API} from './services/Api'

function App() {
    const [data,setData] = useState([])
    const [categories,setCategories] = useState({})
    const [listIds,setListIds] = useState([])
    const [initialValues,setInitialValues] = useState({
        applicable_items: [],
        applied_to: "some",
        name: '',
        rate: 5,
    })
    const [groupByCategory, setGroupByCategory] = useState({})

    useEffect(()=>{
        fetchData();
    },[])
    useEffect(()=>{
        categorize()
    },[data])

    const fetchData =async()=>{
        const data = await API.getData();
        setData(data)
    }

    const findBy= async(key)=>{
        const data = await API.search(key);
        setData(data)
    }

    const categorize=()=>{
        const category = {};
        const groupByCategory ={};
        const listIds=[]
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
            listIds.push(item.id);
        });
        // console.log(category);
        console.log(listIds);
        // console.log(groupByCategory);
        setListIds(listIds)
        setCategories(category)
        setGroupByCategory(groupByCategory)
    }

    const renderCategory = (categoryItem,values,arrayHelpers,setValues) => {
        const groupData=categoryItem[0]!='other'?groupByCategory[categories[categoryItem[0]]?.id]:groupByCategory['other'];
        const arr = groupData?.filter(item=>values?.applicable_items?.includes(item.id))
        console.log(categoryItem[0])
        return <div key={categoryItem[0]}>
            <div style={{backgroundColor:"#c0bbbb7d",paddingLeft:3,paddingTop:4,paddingBottom:4}}><label>
                <Field type="checkbox" name={categoryItem[0]+"1"}
                    style={{color:'yellow'}}
                    checked={arr?.length === groupData?.length}
                    onChange={(e) => {
                        if (e.target.checked){

                            categoryItem[1].forEach(item=> {
                                  const idx = values.applicable_items.findIndex(
                                    category => category === item.id
                                  );
                                  idx === -1 && arrayHelpers.push(item.id);
                                // }
                              })
                        }
                        else {
                            const newCurr=values.applicable_items.filter(id=> {
                            const has=groupData.some(item=>item.id==id);
                            return !has;
                        })
                        // console.log(newCurr,groupData)
                        // debugger
                        setValues({...values,applicable_items:newCurr})
                              console.log(values.applicable_items)
                        }
                    }}

                />
                {categoryItem[0]!='other'?categories[categoryItem[0]]?.name:""}
            </label>
            </div>
            <div>
                {
                    
                <FieldArray name="applicable_items">
                {(arrayHelpers) => {
                  return (
                    <div className="ahuhu">
                      {groupData?.map((item) => {
                        return renderItems(item,values,arrayHelpers)
                      })}
                    </div>
                  );
                }}
              </FieldArray>

                }
            </div>
        </div>
    }
    const renderItems=(item,values,arrayHelpers)=>{

        return <div key={item.id} style={{margin:10}}>
            <label>
                <Field type="checkbox" name="applicable_items" 
                checked={
                    values.applicable_items?.findIndex(
                        (category) =>
                            category === item.id
                    ) !== -1
                }
                    onChange={(e) => {
                        if (e.target.checked)
                            arrayHelpers.push(item.id);
                        else {
                            // console.log(values.applicable_items)
                            const idx = values.applicable_items.findIndex(category =>category === item.id);
                            arrayHelpers.remove(idx);
                            
                        }
                    }} />
                {item.name}
            </label>
        </div>
    }

    return (
        <div>
            <h2>Add Tax</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    alert(JSON.stringify(values, null, 2));
                }}

            >
                {({ errors, values, touched, setValues }) => (
                    <Form>
                        <Field id="name" name="name" placeholder="Tax Name" />
                        <Field
                            placeholder="ratio"
                            type="number"
                            id='rate'
                            name='rate'
                        />
                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="applied_to" value="all" 
                                selected={values?.applied_to === 'all'} 
                                onChange={(e)=>{
                                    console.log(e.target.checked)
                                    console.log(listIds)
                                    if(e.target.checked ) setValues({...values,applied_to:"all",applicable_items:[...listIds]})
                                    // else setValues({...values,applied_to:"some"})
                                    // console.log(values.applicable_items)
                                }}
                                />
                                Apply to all items in collection
                            </label>
                            <label>
                                <Field type="radio" name="applied_to" value="some" 
                                selected={values?.applied_to === 'some'} 
                                 />
                                Apply to specific items
                            </label>
                            <div>Picked: {values.applied_to}</div>
                        </div>
                        <div>
                        <input id="search" type='text' placeholder="Search Items" onChange={(e)=>{
                            findBy(e.target.value)
                        }} />
                        </div>
                        <div role="group" aria-labelledby="checkbox-group">
                            <FieldArray name="applicable_items">
                                {(arrayHelpers) => {
                                    return (
                                        Object.entries(groupByCategory).map((item) => {
                                            return renderCategory(item, values, arrayHelpers,setValues);
                                        })
                                    );
                                }}
                            </FieldArray>
                        </div>
                        <Button type='submit'> Add Tax to {values?.applicable_items?.length} Item(s)</Button>
                    </Form>)}
            </Formik>
        </div>
    )
}

export default App