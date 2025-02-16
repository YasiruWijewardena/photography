// pages/photographers/index.js

export async function getServerSideProps() {
    return {
      redirect: {
        destination: '/photographers/page/1',
        permanent: false,
      },
    };
  }
  
  export default function Photographers() {
    return null;
  }