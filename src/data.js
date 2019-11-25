export const config = {
  plates: [
    "dummy",
    "IgM RFs",
    "IgG RFs",
    "anti-CCP",
    "ANA",
    "dsDNA",
    "Sm",
    "RNP"
  ],
  secondaryAntibodies: {
    "test-a": {
      efficiency: 1,
      binding: 0.04,
      microPerMil: 500
    },
    "test-b": {
      plates: ["dummy", "RNP"],
      efficiency: 1.9,
      binding: 0.08,
      microPerMil: 500
    }
  },
  wavelengths: {
    "450nm": "1.0",
    "520nm": "0.4",
    "544nm": "0.2",
    "590nm": "0.14",
    "645nm": "0.11"
  }
};

export const samples = [
  {
    subject: "00a",
    condition: ["RA"],
    gender: "f",
    code: "v3002",
    plates: {
      dummy: 15.2,
      "IgM RFs": 15.2,
      "IgG RFs": 1,
      "IgA RFs": 2,
      "anti-CCP": 15,
      ANA: 2,
      dsDNA: 0,
      Sm: 0,
      RNP: 0
    }
  },
  {
    subject: "001",
    condition: ["RA"],
    gender: "f",
    code: "v3002",
    plates: {
      dummy: 15.6,
      "IgM RFs": 70,
      "IgG RFs": 1,
      "IgA RFs": 2,
      "anti-CCP": 15,
      ANA: 2,
      dsDNA: 0,
      Sm: 0,
      RNP: 0
    }
  },
  {
    subject: 201,
    condition: ["RA"],
    gender: "f",
    code: "v3002",
    plates: {
      dummy: 50,
      "IgM RFs": 4,
      "IgG RFs": 4,
      "IgA RFs": 2,
      "anti-CCP": 15,
      ANA: 2,
      dsDNA: 0,
      Sm: 0,
      RNP: 0
    }
  },
  {
    subject: 202,
    condition: ["RA"],
    gender: "f",
    code: "n1002",
    plates: {
      dummy: 0.42,
      "IgM RFs": 80,
      "IgG RFs": 120,
      "IgA RFs": 4,
      "anti-CCP": 80,
      ANA: 0,
      dsDNA: 0,
      Sm: 0,
      RNP: 1
    }
  },
  {
    subject: 203,
    condition: ["RA"],
    gender: "m",
    code: "P1004",
    plates: {
      dummy: 6.1,
      "IgM RFs": 80,
      "IgG RFs": 160,
      "IgA RFs": 10,
      "anti-CCP": 40,
      ANA: 8,
      dsDNA: 8,
      Sm: 0,
      RNP: 12
    }
  },
  {
    subject: "bob",
    condition: ["RA"],
    gender: "m",
    code: "P1004",
    plates: {
      dummy: 0.17,
      "IgM RFs": 80,
      "IgG RFs": 160,
      "IgA RFs": 10,
      "anti-CCP": 40,
      ANA: 8,
      dsDNA: 8,
      Sm: 0,
      RNP: 12
    }
  },
  {
    subject: "sue",
    condition: ["RA"],
    gender: "f",
    code: "P1004",
    plates: {
      dummy: 0.34,
      "IgM RFs": 80,
      "IgG RFs": 160,
      "IgA RFs": 10,
      "anti-CCP": 40,
      ANA: 8,
      dsDNA: 8,
      Sm: 0,
      RNP: 12
    }
  },
  {
    subject: "lisa",
    condition: ["RA"],
    gender: "f",
    code: "P1004",
    plates: {
      dummy: 70,
      "IgM RFs": 80,
      "IgG RFs": 160,
      "IgA RFs": 10,
      "anti-CCP": 40,
      ANA: 8,
      dsDNA: 8,
      Sm: 0,
      RNP: 12
    }
  }
];
