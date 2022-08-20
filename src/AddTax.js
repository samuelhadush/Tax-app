import React,{useEffect,useState} from 'react'
import { Formik, Field,FieldArray, Form,ErrorMessage,getIn } from 'formik';
import * as Yup from "yup";
import { AiOutlineSearch } from 'react-icons/ai';


import Button from './components/Button';
import {API} from './services/Api'

const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required'),
    rate: Yup.number()
      .required('Required'),
  });

function AddTax() {
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
        setListIds(listIds)
        setCategories(category)
        setGroupByCategory(groupByCategory)
    }

    const handlCategoryClick= (e,categoryItem,values,groupData,setValues,arrayHelpers) => {
        if (e.target.checked){
            categoryItem[1].forEach(item=> {
                  const idx = values.applicable_items.findIndex(
                    category => category === item.id
                  );
                  idx === -1 && arrayHelpers.push(item.id);
              })
        }
        else {
            const newCurr=values.applicable_items.filter(id=> {
            const has=groupData.some(item=>item.id==id);
            return !has;
        })
        setValues({...values,applied_to:'some', applicable_items:newCurr})
              console.log(values.applicable_items)
        }
    }
    const handlItemClick= (e,item,values,setValues,arrayHelpers) => {
            if (e.target.checked)
                arrayHelpers.push(item.id);
            else {
                const idx = values.applicable_items.findIndex(category =>category === item.id);
                const newItems = values.applicable_items.filter(category =>category !== item.id);
                // arrayHelpers.remove(idx);
                setValues({...values,applied_to:'some',applicable_items:[...newItems]})
            }
    }

    const renderCategory = (categoryItem,values,arrayHelpers,setValues) => {
        const groupData=categoryItem[0]!='other'?groupByCategory[categories[categoryItem[0]]?.id]:groupByCategory['other'];
        const arr = groupData?.filter(item=>values?.applicable_items?.includes(item.id))
        return <div key={categoryItem[0]}>
            <div style={{backgroundColor:"#E4E6EA",paddingLeft:3,paddingTop:"0.65rem",paddingBottom:"0.65rem"}}>
                <label className='checkbox1'>
                <Field type="checkbox" className='checkbox3' name={categoryItem[0]+"1"}
                    style={{color:'yellow'}}
                    checked={arr?.length === groupData?.length}
                    onChange={(e)=>handlCategoryClick(e,categoryItem,values,groupData,setValues,arrayHelpers)}
                />
                <span></span>
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
                        return renderItems(item,values,arrayHelpers,setValues)
                      })}
                    </div>
                  );
                }}
              </FieldArray>

                }
            </div>
        </div>
    }
    const renderItems=(item,values,arrayHelpers,setValues)=>{

        return <div key={item.id}  style={{margin:10}}>
            <label className='checkbox1'>
                <Field type="checkbox" className='checkbox3' name="applicable_items" 
                checked={values.applicable_items?.findIndex((category) =>category === item.id) !== -1}
                    onChange={(e)=>handlItemClick(e,item,values,setValues,arrayHelpers)} />
                    <span></span>
                {item.name}
            </label>
        </div>
    }

    const  getStyles =(errors, fieldName)=> {
        if (getIn(errors, fieldName)) {
          return {
            border: '1px solid red'
          }
        }
      }

    return (
        <div>
            <h2 className='title'>Add Tax</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values) => {
                    alert(JSON.stringify(values, null, 2));
                }}
            >
                {({ errors, values, touched, setValues }) => (
                    <Form>
                        <div className='content tax-name-rate'>
                        <Field id="name" name="name"
                            placeholder="Tax Name"
                            style={getStyles(errors, "name")}
                        />
                        {/* <ErrorMessage name="name" /> */}
                        <div className='rate' style={getStyles(errors, "rate")}><Field
                            placeholder="ratio"
                            type="number"
                            id='rate'
                            name='rate'

                        /><span>%</span>
                        </div>
                        </div>
                        {/* <ErrorMessage name="rate" /> */}
                        <div className='content radio-group' role="group" aria-labelledby="my-radio-group">
                            <label className='radiobtn'>
                                <Field type="radio" name="applied_to" value="all" 
                                selected={values?.applied_to === 'all'} 
                                onChange={(e)=>{
                                    if(e.target.checked ) setValues({...values,applied_to:"all",applicable_items:[...listIds]})
                                }}
                                />
                                <span></span>
                                Apply to all items in collection
                            </label>
                            <label className='radiobtn'>
                                <Field type="radio" name="applied_to" value="some" 
                                selected={values?.applied_to === 'some'} 
                                 />
                            <span></span>
                                Apply to specific items
                            </label>
                        </div>
                    
                        <div className='line'>
                            <div className='seach'>
                        <span><AiOutlineSearch className='seach-icon'/></span>
                        <input id="search" className='search' type='text' placeholder="Search Items" onChange={(e)=>{
                            findBy(e.target.value)
                            setValues({...values,applicable_items:[]})
                        }} /></div>
                        </div>
                        <div className='content' role="group" aria-labelledby="checkbox-group">
                            {Object.entries(groupByCategory).length>0?<FieldArray name="applicable_items">
                                {(arrayHelpers) => {
                                    return (
                                        Object.entries(groupByCategory).map((item) => {
                                            return renderCategory(item, values, arrayHelpers,setValues);
                                        })
                                    );
                                }}
                            </FieldArray>:<div>No Items Found</div>}
                        </div>
                        <div className='content addTax'>
                        {Object.entries(groupByCategory).length>0? <Button type='submit'> Add Tax to {values?.applicable_items?.length} Item(s)</Button>:null}
                        </div>
                    </Form>)}
            </Formik>
        </div>
    )
}

export default AddTax