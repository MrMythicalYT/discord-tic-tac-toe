type ReturnKeysOptions = {
  [x: string]: boolean;
};

type ReturnKeys<K extends ReturnKeysOptions, T> = {
  [x in keyof K]: K[x] extends true ? T : T | null;
};

export default function parseCustomId<R extends ReturnKeysOptions>(
  customId: string,
  names?: R
): { main: string } & ReturnKeys<R, string> {
  if (!customId.includes(".") && !names)
    return { main: customId } as { main: string } & ReturnKeys<R, string>;
  const splitId = customId.split("."),
    main = splitId.shift();
  if (!main)
    throw new Error(
      `Expected main for customId. Custom id passed was ${customId}`
    );
  const entries = names
    ? Object.fromEntries(
        Object.keys(names)
          .map((k, i) => k && [k, splitId[i]])
          .filter(Boolean) as [string, string][]
      )
    : {};
  if (Object.keys(entries).some((k) => !entries[k] && names?.[k]))
    throw new Error(
      `Invalid custom id for these options. Received ${customId}`
    );
  return {
    main,
    ...entries,
  } as { main: string } & ReturnKeys<R, string>;
}
