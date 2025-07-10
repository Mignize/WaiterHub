export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  styleConfig: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: string;
    borderRadius: string;
  };
  createdAt: string;
  updatedAt: string;
};
