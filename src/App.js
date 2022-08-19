import React,{useEffect,useState} from 'react'
import { Formik, Field, Form } from 'formik';
import Button from './components/Button';
import {API} from './services/Api'

function App() {
    const [data,setData] = useState([])
    const [categories,setCategories] = useState({})
    const [groupByCategory,setGroupByCategory] = useState({})

    useEffect(()=>{
        fetchData();
    },[])
    useEffect(()=>{
        categorize()
    },[data])

    const fetchData =async()=>{
        const data = await API.getData();
        setData(data)
        console.log(data)
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
        // console.log(category);
        // console.log(groupByCategory);
        setCategories(category)
        setGroupByCategory(groupByCategory)
    }

    const renderCategory = (categoryItem) => {
        const groupData=categoryItem[0]!='other'?groupByCategory[categories[categoryItem[0]]?.id]:groupByCategory['other'];
        // console.log( groupData)
        return <div>
            <div style={{backgroundColor:"gray"}}><label>
                <Field type="checkbox" name="category" value={`${categories[categoryItem[0]]?.id}`} />
                {categoryItem[0]!='other'?categories[categoryItem[0]]?.name:""}
            </label>
            </div>
            <div>
                {
                    
                groupData.map(item=>{
                     return renderItems(item)
                })
                
                }
            </div>
        </div>
    }
    const renderItems=(item)=>{
        console.log(item);
        return <div key={item.id}>
            <label>
                <Field type="checkbox" name="applicable_items" value={`${item.id}`} />
                {item.name}
            </label>
        </div>
    }

    return (
        <div>
            <h2>Add Tax</h2>
            <Formik
                initialValues={{
                    applicable_items: [],
                    applied_to: "some",
                    name: '',
                    rate: 5,
                }}
                onSubmit={async (values) => {
                    alert(JSON.stringify(values, null, 2));
                }}

            >
                {({ values }) => (
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
                                <Field type="radio" name="applied_to" value="all" selected={values?.applied_to === 'all'} />
                                Apply to all items in collection
                            </label>
                            <label>
                                <Field type="radio" name="applied_to" value="some" selected={values?.applied_to === 'some'} />
                                Apply to specific items
                            </label>
                            <div>Picked: {values.applied_to}</div>
                        </div>
                        <div role="group" aria-labelledby="checkbox-group">
                            {Object.entries(groupByCategory).map(item=>{
                                return renderCategory(item);
                            })}
                        {/* {data?.map(item=>{
                            return <div key={item.id}>
                            <label>
                            <Field type="checkbox" name="applicable_items" value={`${item.id}`} />
                                {item.name}
                            </label>
                            </div>
                        })} */}
                        </div>
                        <Button type='submit'> Add Tax to {values?.applicable_items?.length} Item(s)</Button>
                    </Form>)}
            </Formik>
        </div>
    )
}

export default App