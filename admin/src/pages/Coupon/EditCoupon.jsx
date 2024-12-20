
import { Box, Button, Grid, Typography, TextField, Autocomplete } from "@mui/material";
import Input from 'components/Input';
import PageLayout from 'layouts/PageLayout';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCouponById, useUpdateCoupon, useDeletecoupons } from 'queries/ProductQuery';
import { useParams } from 'react-router-dom';
// import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';


const EditCoupon = () => {
   const { id } = useParams();
   const [details, setDetails] = useState({});
   const { data: res, isLoading } = useGetCouponById({ id });
   const navigate = useNavigate();
   const [category, setCategory] = useState([])
   const [product, setProduct] = useState([])
   // const { data: respo } = useGetSimilarProducts({ pageNo: 1, pageCount: 100 });
   // const { data: catRespo } = useGetCategory({ pageNo: 1, pageCount: 100 });

   useEffect(() => {
      if (res?.data) {
         console.log('res?.data', res?.data);

         res?.data?.products && setProduct(res?.data?.products)
         res?.data?.categorys && setCategory(res?.data?.categorys)
         setDetails(res.data);
         console.log(res.data)
      }
   }, [res]);


   const { mutateAsync: updateCoupon, isLoading: loading } = useUpdateCoupon();
   const { mutateAsync: deletecoupons, isLoading: deleting } = useDeletecoupons()

   const handleChange = (e) => {
      setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   // const fileInputRef = React.useRef(null);

   const handleSubmit = () => {      
      try {
         const formData = new FormData();
         for (const key in details ) {
            if (details.hasOwnProperty(key) && key !== "categorys" && key !== "products") {
               formData.append(key, details[key]);
            }
         }
         let uniqueCategories;
         if (category) {
            uniqueCategories = category
               .filter((cat, index, self) =>
                  index === self.findIndex((t) => t._id === cat._id)
               )
               .map(cat => cat._id);
         }
         let uniqueProducts;
         if (category) {
            uniqueProducts = product
               .filter((prod, index, self) =>
                  index === self.findIndex((t) => t._id === prod._id)
               )
               .map(prod => prod._id);
         } 
         console.log('uniqueCategories',uniqueCategories);
         if (uniqueCategories.length) {
            uniqueCategories.forEach((categoryId) => formData.append('categorys', categoryId));
         }
         if (uniqueProducts.length) {
            uniqueProducts.forEach((productId) => formData.append('products', productId));
         }
         console.log('last');
         

         // category.length && category.forEach((category) => formData.append('categorys', category?._id));
         // product.length && product.forEach((product) => formData.append('products', product._id));

         updateCoupon(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "Coupon updated successfully");
                  navigate('/coupons')
               }
            })
            .catch((err) => {
               toast.error(err?.message ?? "Something went wrong");
            });
      } catch (error) {
         console.error(error);
      }
   };

   const handleDelete = () => {
      deletecoupons(details)
         .then((res) => {
            if (res) {
               navigate('/coupons')
               toast.success(res?.message ?? "coupon deleted Successfully");
            }
         })
         .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
         });
   };



   return (
      <PageLayout title={'Edit Coupon'}>
         {isLoading ? (
            <Typography fontSize={14} sx={{ paddingX: 5 }}>Loading...</Typography>
         ) : (
            <Grid container spacing={5} display={'flex'} direction={'row'} p={8}>
               <Grid item container spacing={2} xs={12} sm={12} md={6} py={5}>
                  <Grid item xs={12} sm={6}>
                     <Input
                        required
                        placeholder="Coupon name"
                        id="name"
                        name="name"
                        value={details?.name || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        required
                        placeholder="Coupon Code"
                        id="code"
                        name="code"
                        label="Coupon code"
                        value={details?.code || ''}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="code"
                        variant="outlined"
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        required
                        type='number'
                        placeholder="Discount Percentage"
                        id="discount"
                        name="discount"
                        value={details?.discount || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  {/* <Grid item xs={12} sm={12}>
                     <DesktopDatePicker
                        label="Validity Date"
                        inputFormat="MM/DD/YYYY"
                        value={details?.validity || null}
                        onChange={(date) => setDetails(prev => ({ ...prev, validity: date }))}
                        renderInput={(params) => <Input {...params} />}
                     />
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                     <Input
                        placeholder="validity"
                        type='date'
                        name="validity"
                        value={details?.validity || ''}
                        onChange={handleChange}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Input
                        type='number'
                        required
                        placeholder="Minimum Value"
                        id="minValue"
                        name="minValue"
                        label="Minimum Value"
                        value={details?.minValue || ''}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="minValue"
                        variant="outlined"
                     />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                     <Input
                        type='number'
                        required
                        placeholder="Maximum Value"
                        id="maxValue"
                        name="maxValue"
                        label="Maximum Value"
                        value={details?.maxValue || ''}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="maxValue"
                        variant="outlined"
                     />
                  </Grid>
                  {/* <Grid item xs={6}>
                     <Autocomplete
                        id="category-select"
                        multiple
                        options={catRespo?.data || []}
                        value={category}
                        onChange={(event, newValue) => {
                           setCategory(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                           <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              <img
                                 loading="lazy"
                                 width="20"
                                 src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                              />
                              <Typography color="inherit" variant="caption">
                                 {option?.name} <br />
                                 {option?.desc}
                              </Typography>
                              <Typography sx={{ ml: 'auto' }} color={option?.isAvailable ? 'success' : 'error'} variant="caption">
                                 {option?.isAvailable ? 'available' : 'NA'}
                              </Typography>
                           </Box>
                        )}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              placeholder="Choose categorys"
                              inputProps={{
                                 ...params.inputProps,
                              }}
                           />
                        )}
                     />
                  </Grid> */}

                  {/* <Grid item xs={6}>
                     <Autocomplete
                        id="Product-select"
                        multiple
                        options={respo?.data || []}
                        value={product}
                        onChange={(event, newValue) => {
                           setProduct(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                           <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              <img
                                 loading="lazy"
                                 width="20"
                                 src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image[0]}`}
                              />
                              <Typography color="inherit" variant="caption">
                                 {option?.name} <br />
                                 {option?.brand}
                              </Typography>
                              <Typography sx={{ ml: 'auto' }} color={option?.isAvailable ? 'success' : 'error'} variant="caption">
                                 {option?.isAvailable ? 'available' : 'NA'}
                              </Typography>
                           </Box>
                        )}
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              placeholder="Choose products"
                              inputProps={{
                                 ...params.inputProps,
                              }}
                           />
                        )}
                     />
                  </Grid> */}

                  <Grid item xs={12} sm={12} mt={'auto'}>
                     <Button onClick={handleSubmit} disabled={loading}>UPDATE COUPON</Button>
                     {/* <Button color="secondary" onClick={handleDelete}>DELETE COUPON</Button> */}

                  </Grid>
               </Grid>
            </Grid>
         )}
      </PageLayout>
   );
};

export default EditCoupon;
