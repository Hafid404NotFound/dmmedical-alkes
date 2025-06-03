import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import ReviewForm from "@/components/ReviewForm";
import { IReview } from "@/types/IReview";
import { createClient } from "@/utils/supabase/server";

export default async function EditReview({ params }: any) {
  const supabase = createClient();
  const query = await (
    await supabase
  )
    .from("review")
    .select()
    .eq("id", params?.id as any);
  const getData: IReview[] = query?.data || [];
  const data = getData[0];
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div>
          <PageTitle title="Edit Review" />
          <ReviewForm data={data} />
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
