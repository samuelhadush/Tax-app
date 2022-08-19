import React,{useEffect,useState} from 'react'
import { Formik, Field,FieldArray, Form,ErrorMessage } from 'formik';
import Button from './components/Button';
import {API} from './services/Api'

function App() {
    const [data,setData] = useState([])
    const [categories,setCategories] = useState({})
    const [initialValues,setInitialValues] = useState({
        applicable_items: [],
        applied_to: "some",
        name: '',
        rate: 5,
    })
    const [groupByCategory,setGroupByCategory] = useState({})

    useEffect(()=>{
        console.log("mounted")
        fetchData();
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
        // console.log(category);
        // console.log(groupByCategory);
        setCategories(category)
        setGroupByCategory(groupByCategory)
    }

    const renderCategory = (categoryItem,values,arrayHelpers) => {
        const groupData=categoryItem[0]!='other'?groupByCategory[categories[categoryItem[0]]?.id]:groupByCategory['other'];
        // console.log( groupData)
        // console.log(values.applicable_items)
        // console.log(categoryItem, categories[categoryItem[0]]);
        // console.log(groupByCategory[categoryItem[0]]);
        // console.log(values?.applicable_items?.length === groupByCategory[categoryItem[0]]?.length);
        // debugger
        const arr = groupData?.filter(item=>values?.applicable_items?.includes(item.id))
        // console.log(values?.applicable_items)
        // console.log(arr)
        // console.log(categoryItem[1]);
        // debugger
        return <div>
            <div style={{backgroundColor:"#c0bbbb7d",paddingLeft:3,paddingTop:4,paddingBottom:4}}><label>
                <Field name={categoryItem[0]}>
                {({
               field, // { name, value, onChange, onBlur }
               form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
             }) => (
                    <checkbox
                    {...field}
                    style={{color:'red'}}
                    // value={`${categoryItem[0]}`}
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
                            // console.log(arr);
                            // debugger
                            groupData.forEach(item=> {
                                values.applicable_items.forEach((category,idx) => {
                                   console.log(idx)
                                   // return category === item.id
                                   if  (category === item.id)arrayHelpers.remove(idx);
                               }
                                 );
                              })
                        }
                    }}

                />)}
                </Field>
                {categoryItem[0]!='other'?categories[categoryItem[0]]?.name:""}
            </label>
            </div>
            <div>
                {
                    
                // groupData.map(item=>{
                //      return renderItems(item)
                // })

                <FieldArray name="applicable_items">
                {(arrayHelpers) => {
                  return (
                    <div className="ahuhu">
                      {groupData.map((item) => {
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
        // console.log(item);

        return <div key={item.id} style={{margin:10}}>
            <label>
                <Field type="checkbox" name="applicable_items" 
                // value={`${item.id}`} 
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
                            const idx = values.applicable_items.findIndex(category =>category === item.id);
                            console.log(idx);
                            debugger
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
                                <Field type="radio" name="applied_to" value="all" 
                                selected={values?.applied_to === 'all'} 
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
                        <div role="group" aria-labelledby="checkbox-group">
                            <FieldArray name="applicable_items">
                                {(arrayHelpers) => {
                                    return (
                                        Object.entries(groupByCategory).map((item) => {
                                            return renderCategory(item, values, arrayHelpers);
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