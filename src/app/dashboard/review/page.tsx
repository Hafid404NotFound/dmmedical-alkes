import Button from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import Divider from "@/components/Divider";
import DeleteReviewButton from "@/components/EditReview";
import IconButton from "@/components/IconButton";
import PageTitle from "@/components/PageTitle";
import { IQuestion } from "@/types/IQuestion";
import { IReqReview } from "@/types/IReqReview";
import { IReview } from "@/types/IReview";
import DateHelper from "@/utils/date-helper";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

export default async function ReviewPage() {
  const dateHelper = new DateHelper();
  const supabase = createClient();
  const query = await (await supabase)
    .from("review")
    .select()
    .order("id", { ascending: false });
  const data: IReview[] = query?.data || [];
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="flex justify-between">
          <PageTitle title="REVIEW" />
          <Link href={"/dashboard/review/new"}>
            <Button>Buat Review</Button>
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((e) => (
            <Card key={e.id}>
              <CardBody>
                <div className="flex w-full justify-between">
                  <div>
                    <div className="font-bold">{e.name}</div>
                    <p className="text-gray-400 text-xs">
                      {dateHelper.toFormatDate(
                        e.created_at,
                        "dd LLLL, yyyy - HH:mm"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={"/dashboard/review/" + e.id}>
                      <IconButton>
                        <MdEdit />
                      </IconButton>
                    </Link>
                    <DeleteReviewButton data={e} />
                  </div>
                </div>
                <div className="my-3">
                  <Divider />
                </div>
                <p>{e.message}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
