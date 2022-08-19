import { Field, FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
// import { AiOutlineSearch } from 'react-icons/ai';

// import Checkbox from '../components/CheckBox';
// import TextInput from '../components/TextInput';
// import
import Button from './components/Button';
import { API } from './services/Api';
// import RadioButton from '../components/RadioButton';
// import { restFetchItems } from '../services/itemsService';

function AddTax() {
  const [categorizedItems, setCategorizedItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const initialValues = {
    applicable_items: [],
    applied_to: 'some',
    name: '',
    rate: 0.05,
  };

  /**
   * Make initial request to get items
   */
  useEffect(() => {
    (async () => {
      const res = await API.getData();
      organizeByCategory(res);
    })();
  }, []);

  /**
   * Make filter request on search state change
   */
  useEffect(() => {
    (async () => {
      const res = await restFetchItems(search);
      organizeByCategory(res);
    })();
  }, [search]);

  /**
   * Form validator
   * @param {*} values
   * @returns
   */
  const validate = (values) => {
    const errors = {};

    if (!values.name) errors.name = 'Required';
    if (!values.rate) errors.rate = 'Required';

    return errors;
  };

  /**
   * Randers all filtered items
   * @param {*} resItems
   */
  const organizeByCategory = (resItems) => {
    let orgByCate = {};
    resItems?.forEach((resItem) => {
      if (resItem.category) {
        if (!orgByCate[resItem?.category?.name]) {
          orgByCate[resItem?.category?.name] = [
            { name: resItem?.name, id: resItem?.id },
          ];
        } else {
          orgByCate[resItem?.category?.name].push({
            name: resItem?.name,
            id: resItem?.id,
          });
        }
      } else {
        if (!orgByCate['']) {
          orgByCate[''] = [{ name: resItem?.name, id: resItem?.id }];
        } else {
          orgByCate[''].push({
            name: resItem?.name,
            id: resItem?.id,
          });
        }
      }
    });
    setCategorizedItems(orgByCate);
    setCategories(Object.keys(orgByCate).sort((a, b) => (a > b ? -1 : 1)));
  };

  /**
   * Will submit form result to the appropriate api
   * @param {*} values
   */
  const onSubmit = (values) => {
    console.log(values);
    alert(JSON.stringify(values, null, 4));
  };

  /**
   * Get the ids for category items
   * @param {*} category
   * @returns array ids of the items for the given category
   */
  const getCategoryItemIds = (category) => {
    return categorizedItems[category]?.map((ci) => ci.id);
  };

  /**
   * Get unique ids in first argument against the values in the second argument
   * @param {*} uniqueFrom
   * @param {*} uniqueAgainst
   * @returns array of unique items
   */
  const getUniqueItems = (uniqueFrom, uniqueAgainst) => {
    return uniqueFrom.filter((item) => {
      return !uniqueAgainst.includes(item);
    });
  };

  /**
   * Select all available items in items list
   * @param {*} values
   * @param {*} setValues
   */
  const selectAllItems = (values, setValues) => {
    let itemIds = [];
    categories.forEach((category) => {
      itemIds = [...itemIds, ...getCategoryItemIds(category)];
    });

    setValues({ ...values, applied_to: 'all', applicable_items: [...itemIds] });
  };

  /**
   * Render items of a given category
   * @param {*} category
   * @param {*} values
   * @param {*} setValues
   * @returns jsx of renders items
   */
  const renderCategoryItems = (category, values, setValues) => {
    return categorizedItems[category]?.map((item) => {
      return (
        <div key={item.id} className="mt-4 w-full pl-4">
          <label className="text-sm w-full inline-block px-3 py-2">
            <input
            type='checkbox'
              checked={values?.applicable_items?.includes(item.id)}
              onChange={(e) => {
                let checked = e.target.checked;
                let applicable_items = checked
                  ? [...values?.applicable_items, item.id]
                  : values?.applicable_items?.filter((ai) => ai !== item.id);
                setValues({
                  ...values,
                  applicable_items: [...applicable_items],
                  applied_to: 'some',
                });
              }}
              color="#327B91"
            />
            <span className="ml-4">{item.name}</span>
          </label>
        </div>
      );
    });
  };

  /**
   * Render all items
   * @param {*} values
   * @param {*} setValues
   * @returns jsx of all rendered items
   */
  const renderItems = (values, setValues) => {
    return categories?.map((category, index) => {
      return (
        <div key={category + index}>
          <div className="mt-4 w-full">
            <label className="text-sm w-full inline-block bg-gray-200 px-3 py-2">
              <input
                type='checkbox'
                checked={(() => {
                  let check = true;
                  categorizedItems[category]?.forEach((ci) => {
                    if (!values?.applicable_items?.includes(ci.id)) {
                      check = false;
                    }
                  });
                  return check;
                })()}
                onChange={(e) => {
                  let checked = e.target.checked;
                  let categoryItemIds = getCategoryItemIds(category);
                  let applicable_items = checked
                    ? [
                        ...values?.applicable_items,
                        ...getUniqueItems(
                          categoryItemIds,
                          values?.applicable_items,
                        ),
                      ]
                    : values?.applicable_items?.filter(
                        (ai) => !categoryItemIds.includes(ai),
                      );
                  setValues({
                    ...values,
                    applied_to: 'some',
                    applicable_items: [...applicable_items],
                  });
                }}
              />
              <span className="ml-4">{category}</span>
            </label>
          </div>

          {renderCategoryItems(category, values, setValues)}
        </div>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto shadow-md py-8 my-4 text-gray-700">
      <h1 className="text-2xl mb-4 px-8">Add Tax</h1>
      <Formik
        validate={validate}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ errors, values, touched, setValues }) => (
          <Form>
            <div className="flex mb-2 px-8 max-w-xl">
              <Field name="name">
                {({ field }) => (
                  <input
                    type='text'
                    {...field}
                    className="w-3/4 mr-2"
                    placeholder="Tax Name"
                    touched={touched.name}
                    invalid={errors.name}
                  />
                )}
              </Field>
              <Field name="rate">
                {({ field }) => (
                  <input
                    {...field}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        rate: isNaN(e.target.value)
                          ? e.target.value
                          : parseInt(e.target.value) / 100,
                      });
                    }}
                    value={values?.rate ? values?.rate * 100 : ''}
                    className="w-1/4"
                    placeholder="Tax Value"
                    suffix="%"
                    type="number"
                    touched={touched.rate}
                    invalid={errors.rate}
                  />
                )}
              </Field>
            </div>
            <div className="flex-col px-9 my-4 text-sm">
              <Field name="applied_to">
                {({ field }) => (
                  <label className="block mb-2">
                    <input
                    type='radio'
                      {...field}
                      selected={values?.applied_to === 'all'}
                      value="all"
                      onClick={(e) => {
                        if (values?.applied_to === 'some') {
                          selectAllItems(values, setValues);
                        }
                      }}
                    ></input>
                    <span className="ml-2">
                      Apply to all items in collection
                    </span>
                  </label>
                )}
              </Field>
              <Field name="applied_to">
                {({ field }) => (
                  <label className="block">
                    <input
                      type='radio'
                      {...field}
                      selected={values?.applied_to === 'some'}
                      value="some"
                      onClick={(e) => {
                        if (values?.applied_to === 'all') {
                          setValues({ ...values, applied_to: 'some' });
                        }
                      }}
                    ></input>
                    <span className="ml-2">Apply to specific items</span>
                  </label>
                )}
              </Field>
            </div>
            <div className="w-full border-t border-gray-200 px-8 mt-4 pt-4">
              <input
                value={search}
                onChange={(e) => {
                  setValues({ ...values, applicable_items: [] });
                  setSearch(e.target.value);
                }}
                className="w-72"
                type='text'
                placeholder="Search Items"
                prefix={() => (
                //   <AiOutlineSearch className="text-md text-gray-500" />
                <>search</>
                )}
              />
            </div>
            <FieldArray name="applicable_items">
              <div className="w-full px-8">
                {categories?.length > 0 && renderItems(values, setValues)}
                {categories?.length === 0 && (
                  <div className="text-gray-600 text-center p-4 my-4">
                    No Items Found
                  </div>
                )}
              </div>
            </FieldArray>
            {categories?.length > 0 && (
              <div className="w-full flex justify-end px-8">
                <Button type="submit">
                  Apply tax to {values?.applicable_items?.length} item(s)
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

AddTax.propTypes = {};

export default AddTax;
