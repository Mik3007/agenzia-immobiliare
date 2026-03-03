import dns from "dns/promises";

try {
  const r = await dns.resolveSrv("_mongodb._tcp.cluster0.3dzx8rf.mongodb.net");
  console.log("OK", r);
} catch (e) {
  console.log("FAIL", e.code);
}