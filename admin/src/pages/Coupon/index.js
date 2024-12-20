import Button from 'components/Button';
import { Link } from 'react-router-dom';
import PageLayout from "layouts/PageLayout";
import { useGetCategory } from "queries/ProductQuery";
import TableData from "./tableData";

function Category() {
  // const { data, isLoading } = useGetCategory({ pageNo: 1, pageCount: 100 });
  // console.log(data, isLoading);
  return (
    <PageLayout
      title={'Coupon'}
      action={
        <Button component={Link} to={`/coupon/addCoupon`}>Add Coupon</Button>
      }
    >
      <TableData/>
    </PageLayout>
  );
}

export default Category;
