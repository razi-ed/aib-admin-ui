import { Button, Col, Row, Steps } from "antd";
import React from "react";
import { UpsertCoursePage } from ".";
import { UpsertCourseBasicDetailsPage } from "./basic";

export default function CreateCourceContainer({ step = 1 }) {
  function getPage() {
    // eslint-disable-next-line default-case
    switch (step) {
      case 1:
        return <UpsertCourseBasicDetailsPage />;
      case 2:
        return <UpsertCoursePage />;
      case 3:
        return <UpsertCoursePage />;
    }
  }

  return (
    <>
      <Row
        style={{ padding: "2rem 1rem" }}
        justify="space-between"
        className="create-source-header"
      >
        <Col span={16}>
          <Steps size="default" current={step - 1}>
            <Steps.Step title="Step 1 - Basic Details" />
            <Steps.Step title="Step 2 - Batch Setup" />
            <Steps.Step title="Step 3 - Batch Setup" />
          </Steps>
        </Col>
        <Col className="create-source-header-actions">
          <Button style={{ marginRight: "12px" }}>Clear all</Button>
          <Button type="primary">Save & Next </Button>
        </Col>
      </Row>
      {getPage(step)}
    </>
  );
}
