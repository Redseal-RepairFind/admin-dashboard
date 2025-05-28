import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: Register a font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Roboto",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping
    borderBottom: 1,
    borderBottomColor: "#ccc",
    padding: 8,
  },
  tableColHeader: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    wordBreak: "break-word",
  },
  tableCol: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    wordBreak: "break-word",
  },
});

// Define headers in order
const defaultHeaders = [
  "Contractor",
  "Skill",
  "Email",
  "Stage",
  "Strikes",
  "Contact",
  "Region",
  "Account Status",
];

const ContractorsTablePDF = ({
  data,
  headers,
  rowMapper = (item: any) => item,
  size = "A2",
}: {
  data: any[];
  headers: string[];
  rowMapper: (item: any) => Record<string, any>;
  size?: "A1" | "A2" | "A3" | "A4";
}) => (
  <Document>
    <Page size={size} style={styles.page}>
      <View style={styles.table}>
        {/* Headers */}
        <View style={styles.tableRow}>
          {headers.map((header) => (
            <Text style={styles.tableColHeader} key={header}>
              {header}
            </Text>
          ))}
        </View>

        {/* Dynamic Data */}
        {data?.map((item, idx) => {
          const row = rowMapper(item);
          return (
            <View style={styles.tableRow} key={idx}>
              {headers.map((header, i) => (
                <Text style={styles.tableCol} key={i}>
                  {row[header] ?? ""}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default ContractorsTablePDF;

//  const row = {
//    Contractor: item?.name,
//    Skill:
//      item?.profile?.skill ?? item?.profile?.skills?.join(", ") ?? "No Skills",
//    Email: item?.email,
//    Stage: item?.onboarding?.stage?.label || "—",
//    Strikes: item?.sanctions?.length ?? 0,
//    Contact: item?.phoneNumberFull || "—",
//    Region: item?.region?.name || "No Region",
//    AccountStatus:
//      item?.accountStatus === "REVIEWING"
//        ? "INACTIVE"
//        : item?.accountStatus?.includes("APPROVE")
//        ? "ACTIVE"
//        : item?.accountStatus || "—",
//  };
