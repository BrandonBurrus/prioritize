import React from "react";
import Layout from "../components/Layout";
import { Center } from "@chakra-ui/react";
import withAuthenticationCheck from "../hocs/withAuthenticationCheck";

/**
 * App landing page (index)
 */
function Home() {
  return (
    <Layout>
      <Center>
        <p>Home test</p>
      </Center>
    </Layout>
  );
}

export default withAuthenticationCheck(Home);
